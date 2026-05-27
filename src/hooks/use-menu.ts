import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MenuCategory, MenuItem, MenuItemSize, Translations } from "@/lib/menu-types";

function asTranslations(value: unknown): Translations {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Translations;
  }
  return {};
}

export function useMenu() {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const { data: cats, error: e1 } = await supabase
          .from("menu_categories")
          .select("id, slug, name, name_translations, sort_order, is_visible")
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });
        if (e1) throw e1;

        const { data: items, error: e2 } = await supabase
          .from("menu_items")
          .select(
            "id, category_id, name, description, name_translations, description_translations, price, image_url, sizes, sort_order, is_visible, is_ai_generated",
          )
          .eq("is_visible", true)
          .order("sort_order", { ascending: true });
        if (e2) throw e2;

        const byCat: Record<string, MenuItem[]> = {};
        for (const it of items ?? []) {
          const list = byCat[it.category_id] ?? (byCat[it.category_id] = []);
          list.push({
            id: it.id,
            name: it.name,
            description: it.description ?? "",
            price: Number(it.price),
            imageUrl: it.image_url,
            sizes: (it.sizes as MenuItemSize[] | null) ?? null,
            nameTranslations: asTranslations(it.name_translations),
            descriptionTranslations: asTranslations(it.description_translations),
            isAiGenerated: Boolean(it.is_ai_generated),
          });
        }

        const result: MenuCategory[] = (cats ?? []).map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          nameTranslations: asTranslations(c.name_translations),
          items: byCat[c.id] ?? [],
        }));

        if (!cancelled) setCategories(result);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Klaida kraunant meniu");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, error };
}
