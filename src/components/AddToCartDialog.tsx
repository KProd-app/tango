import { useEffect, useState } from "react";
import { Minus, Plus, ShoppingCart, UtensilsCrossed, Expand } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/lib/cart-context";
import { useSuggestions } from "@/lib/suggestions-context";
import type { MenuItem } from "@/lib/menu-types";
import { toast } from "sonner";
import { ImageLightbox } from "./ImageLightbox";

type Props = {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function formatPrice(p: number) {
  return `${p.toFixed(2).replace(".", ",")} €`;
}

export function AddToCartDialog({ item, open, onOpenChange }: Props) {
  const { addItem, setOpen: setCartOpen } = useCart();
  const { showSuggestions } = useSuggestions();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState("");
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (open && item) {
      setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0].size : null);
      setQuantity(1);
      setComment("");
    }
  }, [open, item]);

  if (!item) return null;

  const sizeObj = item.sizes?.find((s) => s.size === selectedSize) ?? null;
  const unitPrice = sizeObj ? sizeObj.price : item.price;
  const total = unitPrice * quantity;

  function handleAdd() {
    if (!item) return;
    addItem({
      productId: item.id,
      name: item.name,
      imageUrl: item.imageUrl ?? null,
      size: selectedSize,
      unitPrice,
      quantity,
      comment: comment.trim(),
    });
    toast.success(`Pridėta į krepšelį`, {
      description: `${item.name}${selectedSize ? ` (${selectedSize})` : ""} × ${quantity}`,
      action: {
        label: "Atidaryti",
        onClick: () => setCartOpen(true),
      },
    });
    onOpenChange(false);
    // Show contextual upsell suggestions after a brief delay
    setTimeout(() => showSuggestions(item.id), 250);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[94vh] w-[calc(100vw-1rem)] max-w-md overflow-y-auto bg-card p-0 sm:w-full [&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:opacity-100 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:hover:bg-primary/90 [&>button]:shadow-lg [&>button]:z-10">
          {item.imageUrl ? (
            <div className="px-3 pt-3 sm:px-4 sm:pt-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="group relative mx-auto block aspect-[16/10] w-full max-w-[260px] overflow-hidden rounded-lg bg-charcoal sm:max-w-xs"
                aria-label="Atidaryti pilną nuotrauką"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  width={600}
                  height={375}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-90 backdrop-blur-sm transition group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" />
                </span>
              </button>
            </div>
          ) : (
            <div className="flex h-20 items-center justify-center bg-gradient-to-br from-charcoal to-card sm:h-24">
              <UtensilsCrossed className="h-10 w-10 text-primary/40 sm:h-12 sm:w-12" />
            </div>
          )}

          <div className="px-3 pb-3 sm:px-4 sm:pb-4">
            <DialogHeader className="space-y-1">
              <DialogTitle className="font-display text-xl tracking-wider sm:text-2xl">
                {item.name}
              </DialogTitle>
              {item.description && (
                <DialogDescription className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  {item.description}
                </DialogDescription>
              )}
            </DialogHeader>

            <div className="mt-3 space-y-3">
              {item.sizes && item.sizes.length > 0 && (
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pasirinkite dydį
                  </Label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {item.sizes.map((s) => {
                      const active = s.size === selectedSize;
                      return (
                        <button
                          key={s.size}
                          type="button"
                          onClick={() => setSelectedSize(s.size)}
                          className={`flex flex-col items-center justify-center rounded-md border px-2 py-2 text-center transition-all ${
                            active
                              ? "border-primary bg-primary/10 text-primary shadow-[0_0_20px_oklch(0.55_0.22_27/0.3)]"
                              : "border-border bg-background/50 text-foreground hover:border-primary/40"
                          }`}
                        >
                          <span className="font-display text-base tracking-wider">
                            {s.size}
                          </span>
                          <span className="mt-0.5 text-[11px] text-muted-foreground">
                            {formatPrice(s.price)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="cart-comment" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Komentaras (neprivaloma)
                </Label>
                <Textarea
                  id="cart-comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 300))}
                  placeholder="Pvz. be svogūnų, papildomai sūrio…"
                  rows={2}
                  className="resize-none bg-background/50 text-sm"
                />
                <p className="text-right text-[10px] text-muted-foreground">
                  {comment.length}/300
                </p>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-md border border-border bg-background/50 p-2.5">
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Kiekis
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Mažinti kiekį"
                    className="h-7 w-7 rounded-full"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-7 text-center font-display text-base tracking-wider" aria-live="polite">
                    {quantity}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Didinti kiekį"
                    className="h-7 w-7 rounded-full"
                    onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-4 flex-row items-center justify-between sm:space-x-0">
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Suma
                </span>
                <span className="font-display text-xl text-primary sm:text-2xl">
                  {formatPrice(total)}
                </span>
              </div>
              <Button
                type="button"
                size="default"
                onClick={handleAdd}
                className="ml-auto bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="h-4 w-4" />
                Į krepšelį
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {item.imageUrl && (
        <ImageLightbox
          src={item.imageUrl}
          alt={item.name}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
