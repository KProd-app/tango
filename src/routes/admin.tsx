import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  ChefHat,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  ImageIcon,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";
import { PromoBannerManager } from "@/components/admin/PromoBannerManager";
import { AccessCodeManager } from "@/components/admin/AccessCodeManager";
import { OrdersManager } from "@/components/admin/OrdersManager";

import { Sparkles, X } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — Tango Pizza & Grill" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Translations = Partial<Record<"en" | "fr" | "pl" | "ru" | "es", string>>;

type Category = {
  id: string;
  slug: string;
  name: string;
  name_translations: Translations;
  sort_order: number;
  is_visible: boolean;
};

type Size = { size: string; price: number };

type Item = {
  id: string;
  category_id: string;
  name: string;
  description: string;
  name_translations: Translations;
  description_translations: Translations;
  price: number;
  image_url: string | null;
  sizes: Size[] | null;
  sort_order: number;
  is_visible: boolean;
  is_ai_generated: boolean;
};

const TRANSLATION_LANGS: Array<{ code: keyof Translations; label: string; flag: string }> = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

function AdminPage() {
  const navigate = useNavigate();
  const { session, isAdmin, loading, signOut, user } = useAuth();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItemOpen, setNewItemOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"menu" | "orders">("orders");

  // Auth gate
  useEffect(() => {
    if (loading) return;
    if (!session) {
      navigate({ to: "/auth" });
    } else if (!isAdmin) {
      toast.error("Neturite administratoriaus teisių");
      navigate({ to: "/" });
    }
  }, [loading, session, isAdmin, navigate]);

  async function loadData() {
    const [{ data: cats }, { data: its }] = await Promise.all([
      supabase.from("menu_categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("sort_order"),
    ]);
    if (cats) {
      setCategories(
        (cats as Array<Omit<Category, "name_translations"> & { name_translations: unknown }>).map(
          (c) => ({
            ...c,
            name_translations: (c.name_translations as Translations | null) ?? {},
          }),
        ),
      );
      if (!activeCat && cats.length > 0) setActiveCat(cats[0].id);
    }
    if (its) {
      setItems(
        (
          its as Array<
            Omit<Item, "sizes" | "name_translations" | "description_translations"> & {
              sizes: unknown;
              name_translations: unknown;
              description_translations: unknown;
            }
          >
        ).map((it) => ({
          ...it,
          sizes: (it.sizes as Size[] | null) ?? null,
          name_translations: (it.name_translations as Translations | null) ?? {},
          description_translations: (it.description_translations as Translations | null) ?? {},
        })),
      );
    }
  }

  useEffect(() => {
    if (isAdmin) loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const filteredItems = items.filter((it) => it.category_id === activeCat);
  const activeCatObj = categories.find((c) => c.id === activeCat);

  async function deleteCategory(cat: Category) {
    if (!confirm(`Ištrinti kategoriją "${cat.name}" ir VISUS jos patiekalus?`)) return;
    setBusy(true);
    const { error } = await supabase.from("menu_categories").delete().eq("id", cat.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Kategorija ištrinta");
    if (activeCat === cat.id) setActiveCat(null);
    loadData();
  }

  async function toggleCategoryVisible(cat: Category) {
    const { error } = await supabase
      .from("menu_categories")
      .update({ is_visible: !cat.is_visible })
      .eq("id", cat.id);
    if (error) toast.error(error.message);
    else loadData();
  }

  async function deleteItem(item: Item) {
    if (!confirm(`Ištrinti "${item.name}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Patiekalas ištrintas");
      loadData();
    }
  }

  async function toggleItemVisible(item: Item) {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_visible: !item.is_visible })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else loadData();
  }

  async function clearItemImage(item: Item) {
    if (!confirm(`Ištrinti „${item.name}" nuotrauką?`)) return;
    const { error } = await supabase
      .from("menu_items")
      .update({ image_url: null })
      .eq("id", item.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Nuotrauka ištrinta");
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ChefHat className="h-6 w-6 text-primary" />
            <h1 className="font-display text-2xl tracking-wider">ADMIN</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Į svetainę</span>
              </Link>
            </Button>
            <span className="hidden text-xs text-muted-foreground md:inline">{user?.email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              Atsijungti
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs bar */}
      <div className="border-b border-border/40 bg-card/20 sticky top-[73px] z-30">
        <div className="mx-auto flex max-w-7xl gap-6 px-6">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`py-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "orders"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Užsakymai (Realtime)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("menu")}
            className={`py-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === "menu"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Meniu valdymas
          </button>
        </div>
      </div>

      {activeTab === "orders" ? (
        <div className="mx-auto max-w-7xl px-6 py-8">
          <OrdersManager />
        </div>
      ) : (
        <>
          <div className="mx-auto max-w-7xl space-y-6 px-6 pt-8">
            <PromoBannerManager />
            <AccessCodeManager />
            <MissingImagesManager
              items={items}
              categories={categories}
              onChanged={loadData}
            />
          </div>

          <div className="mx-auto grid max-w-7xl gap-6 px-6 pb-8 lg:grid-cols-[280px_1fr]">
            {/* Categories sidebar */}
            <aside className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg tracking-wider">KATEGORIJOS</h2>
                <Button size="sm" onClick={() => setNewCatOpen(true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <ul className="space-y-1">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <div
                      className={`group flex items-center gap-2 rounded-md border px-2 py-2 transition-all ${
                        activeCat === cat.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card/60 hover:border-primary/40"
                      } ${!cat.is_visible ? "opacity-50" : ""}`}
                    >
                      <button
                        type="button"
                        onClick={() => setActiveCat(cat.id)}
                        className="flex flex-1 items-center gap-2 text-left text-sm"
                      >
                        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
                        <span className="flex-1 truncate">{cat.name}</span>
                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                          {items.filter((i) => i.category_id === cat.id).length}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleCategoryVisible(cat)}
                        className="text-muted-foreground hover:text-primary"
                        title={cat.is_visible ? "Slėpti" : "Rodyti"}
                      >
                        {cat.is_visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCat(cat)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteCategory(cat)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Items area */}
            <main>
              {activeCatObj ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="font-display text-3xl tracking-wider">
                        {activeCatObj.name.toUpperCase()}
                      </h2>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {filteredItems.length} patiekalai
                      </p>
                    </div>
                    <Button onClick={() => setNewItemOpen(true)} disabled={busy}>
                      <Plus className="h-4 w-4" />
                      Naujas patiekalas
                    </Button>
                  </div>

                  <div className="grid gap-3">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        className={`flex gap-4 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40 ${
                          !item.is_visible ? "opacity-50" : ""
                        }`}
                      >
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-charcoal">
                          {item.image_url ? (
                            <>
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => clearItemImage(item)}
                                title="Ištrinti nuotrauką"
                                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive/90 text-white shadow-md transition-colors hover:bg-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-display text-base tracking-wider">{item.name}</h4>
                            <span className="font-display text-base text-primary">
                              {item.sizes && item.sizes.length > 1
                                ? `nuo ${item.sizes[0].price.toFixed(2)} €`
                                : `${Number(item.price).toFixed(2)} €`}
                            </span>
                          </div>
                          {item.description && (
                            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleItemVisible(item)}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-primary"
                            >
                              {item.is_visible ? (
                                <Eye className="h-3.5 w-3.5" />
                              ) : (
                                <EyeOff className="h-3.5 w-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-primary"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteItem(item)}
                              className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-destructive"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredItems.length === 0 && (
                      <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                        Patiekalų dar nėra. Spauskite „Naujas patiekalas".
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                  Pasirinkite kategoriją iš kairės arba sukurkite naują.
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* Category dialog */}
      <CategoryDialog
        open={newCatOpen || !!editingCat}
        category={editingCat}
        nextSortOrder={categories.length}
        onClose={() => {
          setNewCatOpen(false);
          setEditingCat(null);
        }}
        onSaved={loadData}
      />

      {/* Item dialog */}
      <ItemDialog
        open={newItemOpen || !!editingItem}
        item={editingItem}
        categoryId={activeCat}
        nextSortOrder={filteredItems.length}
        onClose={() => {
          setNewItemOpen(false);
          setEditingItem(null);
        }}
        onSaved={loadData}
      />
    </div>
  );
}

// ============================================================================
// Category Dialog
// ============================================================================

function CategoryDialog({
  open,
  category,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  open: boolean;
  category: Category | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [translations, setTranslations] = useState<Translations>({});
  const [busy, setBusy] = useState(false);
  const [translating, setTranslating] = useState(false);

  async function autoTranslate() {
    if (!name.trim()) {
      toast.error("Pirma įrašykite lietuvišką pavadinimą");
      return;
    }
    setTranslating(true);
    try {
      const { translateLt } = await import("@/lib/translate");
      const result = await translateLt(name);
      setTranslations({ ...translations, ...result });
      toast.success("Išversta");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Vertimo klaida");
    } finally {
      setTranslating(false);
    }
  }

  useEffect(() => {
    if (open) {
      setName(category?.name ?? "");
      setSlug(category?.slug ?? "");
      setTranslations(category?.name_translations ?? {});
    }
  }, [open, category]);

  function slugify(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const finalSlug = slug || slugify(name);
    try {
      if (category) {
        const { error } = await supabase
          .from("menu_categories")
          .update({ name, slug: finalSlug, name_translations: translations })
          .eq("id", category.id);
        if (error) throw error;
        toast.success("Atnaujinta");
      } else {
        const { error } = await supabase.from("menu_categories").insert({
          name,
          slug: finalSlug,
          sort_order: nextSortOrder,
          name_translations: translations,
        });
        if (error) throw error;
        toast.success("Kategorija sukurta");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>{category ? "Redaguoti kategoriją" : "Nauja kategorija"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Pavadinimas (lietuviškai) 🇱🇹</Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!category) setSlug(slugify(e.target.value));
                }}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">URL nuoroda (slug)</Label>
              <Input
                id="cat-slug"
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                required
              />
            </div>

            <div className="rounded-md border border-border bg-card/40 p-3 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Vertimai (neprivaloma)
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={autoTranslate}
                  disabled={translating || !name.trim()}
                >
                  {translating ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Sparkles className="h-3 w-3" />
                  )}
                  Išversti automatiškai
                </Button>
              </div>
              {TRANSLATION_LANGS.map((l) => (
                <div key={l.code} className="space-y-1">
                  <Label htmlFor={`cat-name-${l.code}`} className="text-xs">
                    {l.flag} {l.label}
                  </Label>
                  <Input
                    id={`cat-name-${l.code}`}
                    value={translations[l.code] ?? ""}
                    onChange={(e) =>
                      setTranslations({ ...translations, [l.code]: e.target.value })
                    }
                    placeholder={name}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row items-center justify-end gap-2 border-t border-border bg-background px-6 py-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Atšaukti
            </Button>
            <Button type="submit" variant="destructive" size="sm" disabled={busy}>
              {busy ? "Saugoma..." : "Baigti"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Item Dialog
// ============================================================================

function ItemDialog({
  open,
  item,
  categoryId,
  nextSortOrder,
  onClose,
  onSaved,
}: {
  open: boolean;
  item: Item | null;
  categoryId: string | null;
  nextSortOrder: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [hasSizes, setHasSizes] = useState(false);
  const [nameTr, setNameTr] = useState<Translations>({});
  const [descTr, setDescTr] = useState<Translations>({});
  
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [translating, setTranslating] = useState(false);

  async function autoTranslateAll() {
    if (!name.trim() && !description.trim()) {
      toast.error("Pirma įrašykite lietuvišką tekstą");
      return;
    }
    setTranslating(true);
    try {
      const { translateLt } = await import("@/lib/translate");
      const [n, d] = await Promise.all([
        name.trim() ? translateLt(name) : Promise.resolve({}),
        description.trim() ? translateLt(description) : Promise.resolve({}),
      ]);
      if (Object.keys(n).length) setNameTr({ ...nameTr, ...n });
      if (Object.keys(d).length) setDescTr({ ...descTr, ...d });
      toast.success("Išversta");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Vertimo klaida");
    } finally {
      setTranslating(false);
    }
  }

  useEffect(() => {
    if (open) {
      setName(item?.name ?? "");
      setDescription(item?.description ?? "");
      setPrice(item?.price ? String(item.price) : "");
      setImageUrl(item?.image_url ?? null);
      const itemSizes = item?.sizes ?? [];
      setSizes(itemSizes.length > 0 ? itemSizes : []);
      setHasSizes(itemSizes.length > 0);
      setNameTr(item?.name_translations ?? {});
      setDescTr(item?.description_translations ?? {});
      
    }
  }, [open, item]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Failas per didelis (max 5MB)");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `items/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from("menu-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      setImageUrl(data.publicUrl);
      toast.success("Nuotrauka įkelta");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Įkėlimo klaida");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!categoryId) {
      toast.error("Nepasirinkta kategorija");
      return;
    }
    setBusy(true);
    try {
      const finalSizes = hasSizes && sizes.length > 0 ? sizes : null;
      const finalPrice = finalSizes ? finalSizes[0].price : Number(price) || 0;
      const payload = {
        name,
        description,
        price: finalPrice,
        image_url: imageUrl,
        sizes: finalSizes,
        category_id: categoryId,
        name_translations: nameTr,
        description_translations: descTr,
        is_ai_generated: false,
      };
      if (item) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", item.id);
        if (error) throw error;
        toast.success("Atnaujinta");
      } else {
        const { error } = await supabase
          .from("menu_items")
          .insert({ ...payload, sort_order: nextSortOrder });
        if (error) throw error;
        toast.success("Patiekalas pridėtas");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[90vh] max-w-2xl flex-col gap-0 p-0">
        <DialogHeader className="border-b border-border px-6 py-4">
          <DialogTitle>{item ? "Redaguoti patiekalą" : "Naujas patiekalas"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          {/* Image */}
          <div className="space-y-2">
            <Label>Nuotrauka</Label>
            <div className="flex items-center gap-4">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-charcoal">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm hover:border-primary/40">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  <span>{uploading ? "Įkeliama..." : "Įkelti nuotrauką"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setImageUrl(null)}
                    className="block text-xs text-muted-foreground hover:text-destructive"
                  >
                    Pašalinti nuotrauką
                  </button>
                )}
                <p className="text-[10px] text-muted-foreground">PNG/JPG iki 5MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-name">Pavadinimas (lietuviškai) 🇱🇹</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="item-desc">Aprašymas (lietuviškai) 🇱🇹</Label>
            <Textarea
              id="item-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Translations */}
          <div className="rounded-md border border-border bg-card/40 p-3 space-y-4">
          <div className="flex items-center justify-between gap-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Vertimai (neprivaloma)
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={autoTranslateAll}
                disabled={translating || (!name.trim() && !description.trim())}
              >
                {translating ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Išversti automatiškai
              </Button>
            </div>
            {TRANSLATION_LANGS.map((l) => (
              <div key={l.code} className="space-y-2 border-t border-border/40 pt-3 first:border-t-0 first:pt-0">
                <p className="text-xs font-medium">
                  {l.flag} {l.label}
                </p>
                <div className="space-y-1">
                  <Label htmlFor={`item-name-${l.code}`} className="text-[10px] text-muted-foreground">
                    Pavadinimas
                  </Label>
                  <Input
                    id={`item-name-${l.code}`}
                    value={nameTr[l.code] ?? ""}
                    onChange={(e) => setNameTr({ ...nameTr, [l.code]: e.target.value })}
                    placeholder={name}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`item-desc-${l.code}`} className="text-[10px] text-muted-foreground">
                    Aprašymas
                  </Label>
                  <Textarea
                    id={`item-desc-${l.code}`}
                    value={descTr[l.code] ?? ""}
                    onChange={(e) => setDescTr({ ...descTr, [l.code]: e.target.value })}
                    placeholder={description}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Sizes toggle */}
          <div className="flex items-center justify-between rounded-md border border-border bg-card/60 p-3">
            <div>
              <Label htmlFor="has-sizes" className="cursor-pointer">
                Keli dydžiai
              </Label>
              <p className="text-[10px] text-muted-foreground">
                Pvz. picos: 22cm, 30cm, 40cm
              </p>
            </div>
            <Switch
              id="has-sizes"
              checked={hasSizes}
              onCheckedChange={(v) => {
                setHasSizes(v);
                if (v && sizes.length === 0) {
                  setSizes([{ size: "Mažas", price: 0 }]);
                }
              }}
            />
          </div>

          {!hasSizes && (
            <div className="space-y-2">
              <Label htmlFor="item-price">Kaina (€)</Label>
              <Input
                id="item-price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
          )}

          {hasSizes && (
            <div className="space-y-2">
              <Label>Dydžiai ir kainos</Label>
              <div className="space-y-2">
                {sizes.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input
                      placeholder="Dydis (pvz. 30cm)"
                      value={s.size}
                      onChange={(e) => {
                        const next = [...sizes];
                        next[idx] = { ...s, size: e.target.value };
                        setSizes(next);
                      }}
                    />
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Kaina"
                      value={s.price}
                      onChange={(e) => {
                        const next = [...sizes];
                        next[idx] = { ...s, price: Number(e.target.value) || 0 };
                        setSizes(next);
                      }}
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setSizes(sizes.filter((_, i) => i !== idx))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSizes([...sizes, { size: "", price: 0 }])}
                >
                  <Plus className="h-4 w-4" />
                  Pridėti dydį
                </Button>
              </div>
            </div>
          )}

          </div>

          <div className="flex flex-row items-center justify-end gap-2 border-t border-border bg-background px-6 py-3">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Atšaukti
            </Button>
            <Button type="submit" variant="destructive" size="sm" disabled={busy}>
              {busy ? "Saugoma..." : "Baigti"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Missing Images Manager — patiekalai be nuotraukų
// ============================================================================

function MissingImagesManager({
  items,
  categories,
  onChanged,
}: {
  items: Item[];
  categories: Category[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  const missing = items.filter((it) => !it.image_url);
  const catName = (id: string) => categories.find((c) => c.id === id)?.name ?? "—";

  async function uploadFor(item: Item, file: File) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Failas per didelis (max 5MB)");
      return;
    }
    setUploadingId(item.id);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `items/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("menu-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from("menu-images").getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("menu_items")
        .update({ image_url: data.publicUrl })
        .eq("id", item.id);
      if (dbErr) throw dbErr;
      toast.success(`Nuotrauka įkelta: ${item.name}`);
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Įkėlimo klaida");
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <ImageIcon className="h-5 w-5 text-primary" />
          <div>
            <h2 className="font-display text-lg tracking-wider">PATIEKALAI BE NUOTRAUKŲ</h2>
            <p className="text-xs text-muted-foreground">
              {missing.length} patiekalai laukia nuotraukos
            </p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {open ? "Slėpti" : "Rodyti"}
        </span>
      </button>

      {open && (
        <div className="border-t border-border px-5 py-4">
          {missing.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Visi patiekalai turi nuotraukas 🎉
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {missing.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-md border border-border bg-background/60 p-2"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-charcoal">
                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <p className="truncate text-[10px] uppercase tracking-wider text-muted-foreground">
                      {catName(item.category_id)}
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs hover:border-primary/40">
                    {uploadingId === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    <span>Įkelti</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingId === item.id}
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadFor(item, f);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
