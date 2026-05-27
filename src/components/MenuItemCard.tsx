import { useState, useMemo } from "react";
import { Heart, ShoppingCart, Sparkles, Star, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AddToCartDialog } from "@/components/AddToCartDialog";
import type { MenuItem } from "@/lib/menu-types";
import { pickTranslation } from "@/lib/menu-types";
import { useI18n } from "@/lib/i18n/context";
import { useFavorites } from "@/hooks/use-favorites";
import { getDishTags, DISH_TAG_LABELS } from "@/lib/dish-tags";
import { toast } from "sonner";

export type MenuItemCardProps = {
  item: MenuItem;
  recommended?: boolean;
};

function formatPrice(p: number) {
  return `${p.toFixed(2).replace(".", ",")} €`;
}

export function MenuItemCard({ item, recommended }: MenuItemCardProps) {
  const [open, setOpen] = useState(false);
  const { lang } = useI18n();
  const { isFavorite, toggle } = useFavorites();
  const favorite = isFavorite(item.id);
  const hasMultipleSizes = !!item.sizes && item.sizes.length > 1;
  const minPrice = item.sizes?.length ? item.sizes[0].price : item.price;
  const tags = useMemo(() => getDishTags(item), [item]);

  const localized = useMemo<MenuItem>(
    () => ({
      ...item,
      name: pickTranslation(item.name, item.nameTranslations, lang),
      description: pickTranslation(item.description, item.descriptionTranslations, lang),
    }),
    [item, lang],
  );

  return (
    <>
      <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-all hover:border-primary/50 hover:shadow-[0_20px_60px_-15px_oklch(0.55_0.22_27/0.4)]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="relative aspect-square overflow-hidden bg-charcoal text-left"
          aria-label={localized.name}
        >
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={localized.name}
              loading="lazy"
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-charcoal to-card">
              <UtensilsCrossed className="h-16 w-16 text-primary/40" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
          {recommended && (
            <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary-foreground backdrop-blur-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1 sm:text-[10px]">
              <Star className="h-3 w-3 fill-current" />
              <span className="hidden sm:inline">Rekomenduojame</span>
              <span className="sm:hidden">TOP</span>
            </div>
          )}
          <div className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 font-display text-xs tracking-wider text-primary backdrop-blur-sm sm:right-3 sm:top-3 sm:px-3 sm:py-1 sm:text-lg">
            {hasMultipleSizes ? `nuo ${formatPrice(minPrice)}` : formatPrice(item.price)}
          </div>
        </button>
        {item.isAiGenerated && (
          <div className={`absolute z-10 ${recommended ? "left-2 top-9 sm:left-3 sm:top-11" : "left-2 top-2 sm:left-3 sm:top-3"}`}>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Ši nuotrauka sugeneruota dirbtinio intelekto"
                  className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-background/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-primary backdrop-blur-sm transition-all hover:bg-primary/20 hover:shadow-[0_0_12px_oklch(0.55_0.22_27/0.5)] sm:px-2.5 sm:py-1 sm:text-[10px]"
                >
                  <Sparkles className="h-3 w-3 fill-current" />
                  <span>AI</span>
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-64 text-xs leading-relaxed">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p>Ši nuotrauka sugeneruota dirbtinio intelekto.</p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const nowFav = toggle(item.id);
            toast.success(nowFav ? "Pridėta į mėgstamiausius" : "Pašalinta iš mėgstamiausių", {
              description: localized.name,
            });
          }}
          aria-label={favorite ? "Pašalinti iš mėgstamiausių" : "Pridėti į mėgstamiausius"}
          className={`absolute right-2 top-12 z-10 flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all sm:right-3 sm:top-14 sm:h-9 sm:w-9 ${
            favorite
              ? "border-primary/60 bg-primary/20 text-primary shadow-[0_0_16px_oklch(0.55_0.22_27/0.5)]"
              : "border-border/60 bg-background/80 text-muted-foreground hover:border-primary/40 hover:text-primary"
          }`}
        >
          <Heart className={`h-4 w-4 transition-transform ${favorite ? "fill-current scale-110" : ""}`} />
        </button>
        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h4 className="mb-1 break-words font-display text-sm leading-tight tracking-wider sm:mb-2 sm:text-lg">{localized.name}</h4>
          {tags.length > 0 && (
            <div className="mb-1.5 flex flex-wrap gap-1">
              {tags.map((tag) => {
                const meta = DISH_TAG_LABELS[tag];
                const label = (meta as Record<string, string>)[lang] ?? meta.lt;
                const isSpicy = tag === "spicy";
                return (
                  <span
                    key={tag}
                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider sm:text-[10px] ${
                      isSpicy
                        ? "border-primary/40 bg-primary/10 text-primary"
                        : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    <span aria-hidden>{meta.emoji}</span>
                    {label}
                  </span>
                );
              })}
            </div>
          )}
          {localized.description && (
            <p className="flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-2 sm:text-sm sm:line-clamp-none">{localized.description}</p>
          )}
          <Button
            size="sm"
            className="mt-3 w-full bg-primary px-2 text-xs hover:bg-primary/90 sm:mt-4 sm:text-sm"
            onClick={() => setOpen(true)}
          >
            <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="truncate">{hasMultipleSizes ? "Dydis" : "Į krepšelį"}</span>
          </Button>
        </div>
      </article>

      <AddToCartDialog item={localized} open={open} onOpenChange={setOpen} />
    </>
  );
}
