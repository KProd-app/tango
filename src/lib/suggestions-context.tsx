import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { Plus, Sparkles, UtensilsCrossed, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/lib/cart-context";
import type { MenuItemSize } from "@/lib/menu-types";
import { toast } from "sonner";

type SuggestionItem = {
  id: string;
  name: string;
  imageUrl: string | null;
  price: number;
  sizes: MenuItemSize[] | null;
  categorySlug: string;
};

type SuggestionsContextValue = {
  showSuggestions: (addedItemId: string) => void;
  forceShowSuggestions: (addedItemId?: string) => void;
};

const SuggestionsContext = createContext<SuggestionsContextValue | null>(null);

// food = main dishes/snacks; drinks = drinks+cocktails; sauces = padazai
const FOOD_SLUGS = new Set([
  "neapolietiskos-picos",
  "susi",
  "uzkandziu-padeklai",
  "poke-bowl",
  "griliaus-patiekalai",
  "mesainiai",
  "miltiniai-patiekalai",
  "sriubos",
  "salotos",
  "uzkandziai",
  "picu-rinkiniai-kepimui-namuose",
]);
const DRINK_SLUGS = new Set(["gerimai", "ivairus-kokteiliai"]);
const SAUCE_SLUGS = new Set(["padazai"]);
const SNACK_SLUGS = new Set(["uzkandziai", "uzkandziu-padeklai"]);

function pickTargets(slug: string): string[] {
  if (DRINK_SLUGS.has(slug)) return ["uzkandziai", "mesainiai", "neapolietiskos-picos"];
  if (SAUCE_SLUGS.has(slug)) return ["gerimai", "ivairus-kokteiliai", "uzkandziai"];
  if (SNACK_SLUGS.has(slug)) return ["gerimai", "ivairus-kokteiliai", "padazai"];
  if (FOOD_SLUGS.has(slug)) return ["gerimai", "ivairus-kokteiliai", "padazai"];
  return ["gerimai", "uzkandziai", "padazai"];
}

function formatPrice(p: number) {
  return `${p.toFixed(2).replace(".", ",")} €`;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function SuggestionsProvider({ children }: { children: ReactNode }) {
  const { addItem } = useCart();
  const [items, setItems] = useState<SuggestionItem[]>([]);
  const [open, setOpen] = useState(false);
  const [suggested, setSuggested] = useState<SuggestionItem[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setDisabled(localStorage.getItem("tango-suggestions-disabled") === "1");
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: cats } = await supabase
        .from("menu_categories")
        .select("id, slug")
        .eq("is_visible", true);
      const slugById = new Map<string, string>();
      (cats ?? []).forEach((c) => slugById.set(c.id, c.slug));

      const { data } = await supabase
        .from("menu_items")
        .select("id, category_id, name, image_url, price, sizes")
        .eq("is_visible", true);
      if (cancelled) return;
      const mapped: SuggestionItem[] = (data ?? []).map((it) => ({
        id: it.id,
        name: it.name,
        imageUrl: it.image_url,
        price: Number(it.price),
        sizes: (it.sizes as MenuItemSize[] | null) ?? null,
        categorySlug: slugById.get(it.category_id) ?? "",
      }));
      setItems(mapped);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pickAndShow = useCallback(
    (addedItemId: string | undefined, force: boolean) => {
      if (!force && typeof window !== "undefined" && localStorage.getItem("tango-suggestions-disabled") === "1") return;
      if (items.length === 0) return;
      const added = addedItemId ? items.find((i) => i.id === addedItemId) : undefined;
      const baseSlug = added?.categorySlug ?? "";
      const targets = pickTargets(baseSlug);
      const pool = items.filter(
        (i) => targets.includes(i.categorySlug) && i.id !== addedItemId,
      );
      if (pool.length === 0) return;
      const picked: SuggestionItem[] = [];
      for (const slug of targets) {
        const candidates = shuffle(pool.filter((i) => i.categorySlug === slug && !picked.includes(i)));
        if (candidates.length > 0) picked.push(candidates[0]);
        if (picked.length >= 3) break;
      }
      if (picked.length < 3) {
        const rest = shuffle(pool.filter((i) => !picked.includes(i)));
        for (const r of rest) {
          picked.push(r);
          if (picked.length >= 3) break;
        }
      }
      setSuggested(picked.slice(0, 3));
      setAddedIds(new Set());
      setOpen(true);
    },
    [items],
  );

  const showSuggestions = useCallback(
    (addedItemId: string) => pickAndShow(addedItemId, false),
    [pickAndShow],
  );

  const forceShowSuggestions = useCallback(
    (addedItemId?: string) => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("tango-suggestions-disabled");
      }
      setDisabled(false);
      pickAndShow(addedItemId, true);
    },
    [pickAndShow],
  );

  function quickAdd(it: SuggestionItem) {
    const size = it.sizes && it.sizes.length > 0 ? it.sizes[0] : null;
    addItem({
      productId: it.id,
      name: it.name,
      imageUrl: it.imageUrl,
      size: size?.size ?? null,
      unitPrice: size ? size.price : it.price,
      quantity: 1,
      comment: "",
    });
    setAddedIds((prev) => new Set(prev).add(it.id));
    toast.success("Pridėta į krepšelį", { description: it.name });
  }

  const value = useMemo(() => ({ showSuggestions, forceShowSuggestions }), [showSuggestions, forceShowSuggestions]);

  return (
    <SuggestionsContext.Provider value={value}>
      {children}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] w-[calc(100vw-1rem)] max-w-lg overflow-y-auto bg-card p-4 sm:p-6 [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:opacity-100 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:hover:bg-primary/90 [&>button]:shadow-lg [&>button]:z-10">
          <DialogHeader className="space-y-1">
            <DialogTitle className="flex items-center gap-2 font-display text-xl tracking-wider sm:text-2xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Gal dar ko nors?
            </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              Mūsų pasiūlymai prie tavo užsakymo
            </DialogDescription>
          </DialogHeader>

          <ul className="mt-3 space-y-2">
            {suggested.map((it) => {
              const added = addedIds.has(it.id);
              return (
                <li
                  key={it.id}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background/50 p-2 transition-colors hover:border-primary/40"
                >
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-charcoal">
                    {it.imageUrl ? (
                      <img src={it.imageUrl} alt={it.name} loading="lazy" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <UtensilsCrossed className="h-5 w-5 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h4 className="text-sm font-medium leading-tight">{it.name}</h4>
                    <span className="font-display text-base text-primary">
                      {it.sizes && it.sizes.length > 0
                        ? `nuo ${formatPrice(it.sizes[0].price)}`
                        : formatPrice(it.price)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant={added ? "outline" : "default"}
                    onClick={() => !added && quickAdd(it)}
                    disabled={added}
                    className={added ? "" : "bg-primary hover:bg-primary/90"}
                  >
                    {added ? (
                      "Pridėta"
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Pridėti
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("tango-suggestions-disabled", "1");
                }
                setDisabled(true);
                setOpen(false);
              }}
              className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              Daugiau neberodyti
            </button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
              Ne, ačiū
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SuggestionsContext.Provider>
  );
}

export function useSuggestions() {
  const ctx = useContext(SuggestionsContext);
  if (!ctx) throw new Error("useSuggestions must be used within SuggestionsProvider");
  return ctx;
}
