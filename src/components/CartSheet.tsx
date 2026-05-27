import { useState } from "react";
import { Minus, Plus, ShoppingBag, Sparkles, Trash2, UtensilsCrossed, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { useSuggestions } from "@/lib/suggestions-context";
import { toast } from "sonner";
import { CheckoutDialog } from "@/components/CheckoutDialog";

function formatPrice(p: number) {
  return `${p.toFixed(2).replace(".", ",")} €`;
}

export function CartSheet() {
  const {
    items,
    isOpen,
    setOpen,
    updateQuantity,
    removeItem,
    clear,
    totalQuantity,
    totalPrice,
  } = useCart();
  const { forceShowSuggestions } = useSuggestions();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  function handleCheckout() {
    if (items.length === 0) return;
    setCheckoutOpen(true);
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setOpen}>
        <SheetContent className="flex w-full flex-col bg-card p-0 sm:max-w-md">
          <SheetHeader className="border-b border-border px-6 py-5">
            <SheetTitle className="flex items-center gap-2 font-display text-2xl tracking-wider">
              <ShoppingBag className="h-5 w-5 text-primary" />
              KREPŠELIS
              {totalQuantity > 0 && (
                <span className="ml-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
                  {totalQuantity}
                </span>
              )}
            </SheetTitle>
            <SheetDescription className="text-xs uppercase tracking-wider text-muted-foreground">
              Patikrink užsakymą prieš patvirtindamas
            </SheetDescription>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-6">
                <ShoppingBag className="h-10 w-10 text-primary/60" />
              </div>
              <p className="mb-2 font-display text-lg tracking-wider">
                Krepšelis tuščias
              </p>
              <p className="text-sm text-muted-foreground">
                Pasirinkite patiekalų iš mūsų meniu
              </p>
              <Button
                className="mt-6 bg-primary hover:bg-primary/90"
                onClick={() => setOpen(false)}
              >
                Atidaryti meniu
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <ul className="space-y-3">
                  {items.map((it) => (
                    <li
                      key={it.lineId}
                      className="flex gap-3 rounded-lg border border-border bg-background/50 p-3"
                    >
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-charcoal">
                        {it.imageUrl ? (
                          <img
                            src={it.imageUrl}
                            alt={it.name}
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UtensilsCrossed className="h-6 w-6 text-primary/40" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-medium leading-tight">
                            {it.name}
                            {it.size && (
                              <span className="ml-1 text-xs text-primary">· {it.size}</span>
                            )}
                          </h4>
                          <button
                            onClick={() => removeItem(it.lineId)}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                            aria-label="Pašalinti"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        {it.comment && (
                          <p className="mt-1 text-[11px] italic text-muted-foreground">
                            „{it.comment}"
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(it.lineId, it.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-7 text-center text-sm font-medium">
                              {it.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-6 w-6 rounded-full"
                              onClick={() => updateQuantity(it.lineId, it.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <span className="font-display text-base text-primary">
                            {formatPrice(it.unitPrice * it.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      clear();
                      toast.message("Krepšelis išvalytas");
                    }}
                    className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    Išvalyti krepšelį
                  </button>
                  <button
                    onClick={() => forceShowSuggestions(items[items.length - 1]?.productId)}
                    className="flex items-center gap-1 rounded-full border border-primary/40 px-2 py-1 text-[11px] text-primary transition-colors hover:bg-primary/10"
                  >
                    <Sparkles className="h-3 w-3" />
                    Rodyti pasiūlymus
                  </button>
                </div>
              </div>

              <SheetFooter className="border-t border-border bg-background/30 px-6 py-5">
                <div className="w-full space-y-4">
                  {(() => {
                    const MIN_ORDER = 15;
                    const progress = Math.min(100, (totalPrice / MIN_ORDER) * 100);
                    const remaining = Math.max(0, MIN_ORDER - totalPrice);
                    const reached = totalPrice >= MIN_ORDER;
                    return (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-wider">
                          <span className={reached ? "text-green-500" : "text-muted-foreground"}>
                            {reached
                              ? "Minimali užsakymo suma pasiekta"
                              : `Iki min. užsakymo trūksta ${formatPrice(remaining)}`}
                          </span>
                          <span className="text-muted-foreground">
                            {formatPrice(Math.min(totalPrice, MIN_ORDER))} / {formatPrice(MIN_ORDER)}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      Bendra suma
                    </span>
                    <span className="font-display text-3xl tracking-wider text-primary">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <Button
                    size="lg"
                    className="w-full bg-primary text-base hover:bg-primary/90"
                    onClick={handleCheckout}
                  >
                    Užsakyti
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    Užsakymas bus pateiktas restoranui Tango Pizza & Grill
                  </p>
                </div>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      <CheckoutDialog open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
