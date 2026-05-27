import { useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MapPin, Search, Store, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { DeliveryMap } from "@/components/DeliveryMap";
import { useCart } from "@/lib/cart-context";
import {
  RESTAURANT_LOCATION,
  MAX_DELIVERY_RADIUS_KM,
  MIN_ORDER_FOR_DELIVERY,
  deliveryFeeFor,
  drivingDistanceKm,
} from "@/lib/delivery-zone";
import { supabase } from "@/integrations/supabase/client";

const orderSchema = z.object({
  customer_name: z.string().trim().min(1, "Įveskite vardą").max(200),
  customer_phone: z
    .string()
    .trim()
    .min(4, "Įveskite telefoną")
    .max(50)
    .regex(/^[+\d\s()-]+$/, "Netinkamas telefono formatas"),
  customer_email: z.string().trim().email("Netinkamas el. pašto adresas").max(200),
  comment: z.string().max(1000).optional(),
});

function fmt(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

export function CheckoutDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, totalPrice, clear, setOpen: setCartOpen } = useCart();

  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("Prienai");
  const [doorCode, setDoorCode] = useState("");
  const [needsUtensils, setNeedsUtensils] = useState(false);
  const [payment, setPayment] = useState<"card_on_site" | "cash">("card_on_site");
  const [comment, setComment] = useState("");
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [km, setKm] = useState<number | null>(null);
  const [calcRoute, setCalcRoute] = useState(false);
  const reverseTimer = useRef<number | null>(null);
  const routeTimer = useRef<number | null>(null);

  // Reset form when reopened
  useEffect(() => {
    if (!open) {
      setErrors({});
      setSubmitting(false);
    }
  }, [open]);

  const fee = useMemo(() => (km != null ? deliveryFeeFor(km) : null), [km]);
  const inZone = fee != null;

  const deliveryFee = method === "delivery" ? (fee ?? 0) : 0;
  const grandTotal = totalPrice + deliveryFee;

  const minOrderError =
    method === "delivery" && totalPrice < MIN_ORDER_FOR_DELIVERY
      ? `Minimali užsakymo suma pristatymui — ${fmt(MIN_ORDER_FOR_DELIVERY)}`
      : null;

  // Recalculate driving distance whenever the point changes (debounced)
  useEffect(() => {
    if (!point) {
      setKm(null);
      return;
    }
    if (routeTimer.current) window.clearTimeout(routeTimer.current);
    setCalcRoute(true);
    routeTimer.current = window.setTimeout(async () => {
      const { km: d } = await drivingDistanceKm(RESTAURANT_LOCATION, point);
      setKm(d);
      setCalcRoute(false);
    }, 350);
    return () => {
      if (routeTimer.current) window.clearTimeout(routeTimer.current);
    };
  }, [point]);

  // Reverse-geocode when user clicks map
  async function handleMapSelect(p: { lat: number; lng: number }) {
    setPoint(p);
    if (reverseTimer.current) window.clearTimeout(reverseTimer.current);
    reverseTimer.current = window.setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${p.lat}&lon=${p.lng}&accept-language=lt`,
        );
        const data = await res.json();
        const a = data.address ?? {};
        const road = a.road || a.pedestrian || a.path || "";
        const num = a.house_number || "";
        if (road) setStreet(num ? `${road} ${num}` : road);
        const cityName = a.city || a.town || a.village || a.municipality || "";
        if (cityName) setCity(cityName);
      } catch {
        // ignore
      }
    }, 200);
  }

  // Geocode when user types address
  async function handleGeocode() {
    if (!street.trim()) return;
    setSearching(true);
    try {
      const q = `${street}, ${city || "Prienai"}, Lithuania`;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
      );
      const data = (await res.json()) as Array<{ lat: string; lon: string }>;
      if (data.length === 0) {
        toast.error("Nepavyko rasti adreso žemėlapyje");
        return;
      }
      setPoint({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
    } catch {
      toast.error("Adresų paieška laikinai nepasiekiama");
    } finally {
      setSearching(false);
    }
  }

  async function handleSubmit() {
    const parsed = orderSchema.safeParse({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      comment,
    });

    const fieldErrors: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
    }

    if (method === "delivery") {
      if (!street.trim()) fieldErrors.street = "Įveskite gatvę ir namo numerį";
      if (!city.trim()) fieldErrors.city = "Įveskite miestą";
      if (!point) fieldErrors.point = "Pažymėkite adresą žemėlapyje";
      if (point && !inZone)
        fieldErrors.point = `Adresas už ${MAX_DELIVERY_RADIUS_KM} km zonos`;
      if (totalPrice < MIN_ORDER_FOR_DELIVERY)
        fieldErrors.total = `Minimali suma — ${fmt(MIN_ORDER_FOR_DELIVERY)}`;
    }

    if (items.length === 0) fieldErrors.items = "Krepšelis tuščias";

    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      toast.error("Užpildykite raudonai pažymėtus laukus");
      // Scroll to first missing/invalid field
      const order = [
        "customer_name",
        "customer_phone",
        "customer_email",
        "street",
        "city",
        "point",
      ];
      const idMap: Record<string, string> = {
        customer_name: "name",
        customer_phone: "phone",
        customer_email: "email",
        street: "street",
        city: "city",
        point: "delivery-map-anchor",
      };
      const firstKey = order.find((k) => fieldErrors[k]) ?? Object.keys(fieldErrors)[0];
      const elId = idMap[firstKey];
      if (elId) {
        setTimeout(() => {
          const el = document.getElementById(elId);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            if (el instanceof HTMLInputElement) el.focus();
          }
        }, 50);
      }
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        delivery_method: method,
        address_street: method === "delivery" ? street.trim() : null,
        address_apartment:
          method === "delivery" && apartment.trim() ? apartment.trim() : null,
        address_city: method === "delivery" ? city.trim() : null,
        address_door_code:
          method === "delivery" && doorCode.trim() ? doorCode.trim() : null,
        address_lat: method === "delivery" && point ? point.lat : null,
        address_lng: method === "delivery" && point ? point.lng : null,
        distance_km: method === "delivery" && km != null ? Number(km.toFixed(2)) : null,
        delivery_fee: method === "delivery" ? deliveryFee : 0,
        needs_utensils: needsUtensils,
        payment_method: payment,
        items: items.map((i) => ({
          productId: i.productId,
          name: i.name,
          size: i.size,
          unitPrice: i.unitPrice,
          quantity: i.quantity,
          comment: i.comment,
        })),
        items_total: Number(totalPrice.toFixed(2)),
        total: Number(grandTotal.toFixed(2)),
        comment: comment.trim() || null,
      };

      const { data, error } = await supabase
        .from("orders")
        .insert(payload)
        .select("order_number")
        .single();

      if (error) throw error;

      toast.success(`Užsakymas #${data.order_number} priimtas! Netrukus susisieksime.`);
      clear();
      onOpenChange(false);
      setCartOpen(false);
      // reset
      setName("");
      setPhone("");
      setEmail("");
      setStreet("");
      setApartment("");
      setDoorCode("");
      setComment("");
      setPoint(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Nepavyko išsiųsti užsakymo";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl tracking-wider">
            UŽSAKYMO INFORMACIJA
          </DialogTitle>
          <DialogDescription>
            Užpildykite duomenis ir patvirtinkite užsakymą
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Method */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Pristatymo būdas *</Label>
            <RadioGroup
              value={method}
              onValueChange={(v) => setMethod(v as "delivery" | "pickup")}
              className="grid grid-cols-2 gap-3"
            >
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  method === "delivery"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <RadioGroupItem value="delivery" id="m-del" />
                <Truck className="h-4 w-4" />
                <span className="text-sm">Pristatymas</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  method === "pickup"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <RadioGroupItem value="pickup" id="m-pick" />
                <Store className="h-4 w-4" />
                <span className="text-sm">Atsiėmimas</span>
              </label>
            </RadioGroup>
            {method === "pickup" && (
              <p className="mt-2 text-xs text-muted-foreground">
                📍 {RESTAURANT_LOCATION.address}
              </p>
            )}
          </div>

          {/* Contact */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor="name">Vardas *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={200}
                className={
                  errors.customer_name
                    ? "border-destructive ring-2 ring-destructive/40"
                    : ""
                }
              />
              {errors.customer_name && (
                <p className="mt-1 text-xs text-destructive">{errors.customer_name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="phone">Telefonas *</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={50}
                placeholder="+370 ..."
                className={
                  errors.customer_phone
                    ? "border-destructive ring-2 ring-destructive/40"
                    : ""
                }
              />
              {errors.customer_phone && (
                <p className="mt-1 text-xs text-destructive">{errors.customer_phone}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">El. paštas *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={200}
                className={
                  errors.customer_email
                    ? "border-destructive ring-2 ring-destructive/40"
                    : ""
                }
              />
              {errors.customer_email && (
                <p className="mt-1 text-xs text-destructive">{errors.customer_email}</p>
              )}
            </div>
          </div>

          {/* Delivery address */}
          {method === "delivery" && (
            <div className="space-y-3 rounded-lg border border-border bg-background/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4 text-primary" />
                Pristatymo adresas
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="street">Gatvė, namo numeris *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      maxLength={500}
                      placeholder="pvz. Vytauto g. 5"
                      className={
                        errors.street
                          ? "border-destructive ring-2 ring-destructive/40"
                          : ""
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleGeocode}
                      disabled={searching || !street.trim()}
                      aria-label="Rasti žemėlapyje"
                    >
                      {searching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.street && (
                    <p className="mt-1 text-xs text-destructive">{errors.street}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="apt" className="text-muted-foreground">
                    Buto numeris <span className="text-xs">(neprivaloma)</span>
                  </Label>
                  <Input
                    id="apt"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    maxLength={100}
                    className="border-dashed border-muted-foreground/40"
                  />
                </div>
                <div>
                  <Label htmlFor="city">Miestas *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    maxLength={200}
                    className={
                      errors.city
                        ? "border-destructive ring-2 ring-destructive/40"
                        : ""
                    }
                  />
                  {errors.city && (
                    <p className="mt-1 text-xs text-destructive">{errors.city}</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="door" className="text-muted-foreground">
                    Durų kodas <span className="text-xs">(neprivaloma)</span>
                  </Label>
                  <Input
                    id="door"
                    value={doorCode}
                    onChange={(e) => setDoorCode(e.target.value)}
                    maxLength={50}
                    placeholder="jeigu yra"
                    className="border-dashed border-muted-foreground/40"
                  />
                </div>
              </div>

              <div id="delivery-map-anchor">
                <p className="mb-2 text-xs text-muted-foreground">
                  Spustelėkite žemėlapyje, kad pažymėtumėte tikslią vietą. Žalias ratas
                  – {MAX_DELIVERY_RADIUS_KM} km pristatymo zona.
                </p>
                <div
                  className={
                    errors.point
                      ? "rounded-md ring-2 ring-destructive/60"
                      : ""
                  }
                >
                  <DeliveryMap selected={point} onSelect={handleMapSelect} />
                </div>
                {point && (
                  <div
                    className={`mt-2 rounded-md border px-3 py-2 text-xs ${
                      calcRoute
                        ? "border-border bg-muted/30 text-muted-foreground"
                        : inZone
                          ? "border-green-600/40 bg-green-600/10 text-green-400"
                          : "border-destructive/40 bg-destructive/10 text-destructive"
                    }`}
                  >
                    {calcRoute || km == null ? (
                      <>Skaičiuojamas kelio atstumas…</>
                    ) : (
                      <>
                        Kelio atstumas: <strong>{km.toFixed(1)} km</strong>
                        {inZone ? (
                          <>
                            {" "}
                            · Pristatymo mokestis: <strong>{fmt(fee!)}</strong>
                          </>
                        ) : (
                          <> · Adresas už pristatymo zonos ribų</>
                        )}
                      </>
                    )}
                  </div>
                )}
                {errors.point && (
                  <p className="mt-1 text-xs text-destructive">{errors.point}</p>
                )}
              </div>
            </div>
          )}

          {/* Utensils */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="utensils" className="cursor-pointer">
                Reikalingi vienkartiniai įrankiai? *
              </Label>
              <p className="text-xs text-muted-foreground">
                Šakutės, peiliai, servetėlės
              </p>
            </div>
            <Switch
              id="utensils"
              checked={needsUtensils}
              onCheckedChange={setNeedsUtensils}
            />
          </div>

          {/* Payment */}
          <div>
            <Label className="mb-2 block text-sm font-medium">Mokėjimo būdas *</Label>
            <RadioGroup
              value={payment}
              onValueChange={(v) => setPayment(v as "card_on_site" | "cash")}
              className="grid grid-cols-2 gap-3"
            >
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  payment === "card_on_site"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <RadioGroupItem value="card_on_site" id="p-card" />
                <span className="text-sm">💳 Kortele vietoje</span>
              </label>
              <label
                className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition-colors ${
                  payment === "cash"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:bg-accent"
                }`}
              >
                <RadioGroupItem value="cash" id="p-cash" />
                <span className="text-sm">💵 Grynais</span>
              </label>
            </RadioGroup>
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment">Komentaras užsakymui</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="pvz. paskambinkite atvykus"
            />
          </div>

          {/* Totals */}
          <div className="space-y-1 rounded-lg border border-border bg-background/30 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Prekės</span>
              <span>{fmt(totalPrice)}</span>
            </div>
            {method === "delivery" && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pristatymas</span>
                <span>{point && inZone ? fmt(deliveryFee) : "—"}</span>
              </div>
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="font-display tracking-wider">VISO</span>
              <span className="font-display text-2xl tracking-wider text-primary">
                {fmt(grandTotal)}
              </span>
            </div>
            {minOrderError && (
              <p className="mt-2 text-xs text-destructive">{minOrderError}</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Atšaukti
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || items.length === 0 || !!minOrderError}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Siunčiama...
              </>
            ) : minOrderError ? (
              <>Min. užsakymas 15 €</>
            ) : (
              <>Patvirtinti užsakymą · {fmt(grandTotal)}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
