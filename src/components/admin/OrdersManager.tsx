import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Loader2,
  MapPin,
  Package,
  Phone,
  RefreshCw,
  Trash2,
  Mail,
} from "lucide-react";

type OrderStatus = "new" | "preparing" | "delivering" | "completed" | "cancelled";
type DeliveryMethod = "delivery" | "pickup";
type PaymentMethod = "card_on_site" | "cash";

type OrderItem = {
  productId: string;
  name: string;
  size: string | null;
  unitPrice: number;
  quantity: number;
  comment: string;
};

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  delivery_method: DeliveryMethod;
  address_street: string | null;
  address_apartment: string | null;
  address_city: string | null;
  address_door_code: string | null;
  address_lat: number | null;
  address_lng: number | null;
  distance_km: number | null;
  delivery_fee: number;
  needs_utensils: boolean;
  payment_method: PaymentMethod;
  items: OrderItem[];
  items_total: number;
  total: number;
  comment: string | null;
  status: OrderStatus;
  created_at: string;
};

const STATUS_LABELS: Record<OrderStatus, { label: string; className: string }> = {
  new: { label: "Naujas", className: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
  preparing: {
    label: "Ruošiamas",
    className: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40",
  },
  delivering: {
    label: "Pristatomas",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/40",
  },
  completed: {
    label: "Įvykdytas",
    className: "bg-green-500/20 text-green-300 border-green-500/40",
  },
  cancelled: {
    label: "Atšauktas",
    className: "bg-red-500/20 text-red-300 border-red-500/40",
  },
};

function fmt(n: number) {
  return `${Number(n).toFixed(2).replace(".", ",")} €`;
}

function fmtDate(s: string) {
  return new Date(s).toLocaleString("lt-LT", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      toast.error(error.message);
    } else if (data) {
      setOrders(
        data.map((o) => ({
          ...o,
          items: (o.items as unknown as OrderItem[]) ?? [],
        })) as Order[],
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    load();

    // Realtime updates
    const channel = supabase
      .channel("orders-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => load(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function updateStatus(id: string, status: OrderStatus) {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success(`Statusas: ${STATUS_LABELS[status].label}`);
  }

  async function deleteOrder(id: string, num: number) {
    if (!confirm(`Ištrinti užsakymą #${num}?`)) return;
    const { error } = await supabase.from("orders").delete().eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Užsakymas ištrintas");
  }

  const filtered =
    statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const counts: Record<OrderStatus | "all", number> = {
    all: orders.length,
    new: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const o of orders) counts[o.status]++;

  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl tracking-wider">UŽSAKYMAI</h2>
          <Badge variant="secondary" className="ml-1">
            {counts.all}
          </Badge>
          {counts.new > 0 && (
            <Badge className="bg-blue-500/20 text-blue-300">{counts.new} nauji</Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={statusFilter}
            onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Visi ({counts.all})</SelectItem>
              <SelectItem value="new">Nauji ({counts.new})</SelectItem>
              <SelectItem value="preparing">Ruošiami ({counts.preparing})</SelectItem>
              <SelectItem value="delivering">
                Pristatomi ({counts.delivering})
              </SelectItem>
              <SelectItem value="completed">Įvykdyti ({counts.completed})</SelectItem>
              <SelectItem value="cancelled">Atšaukti ({counts.cancelled})</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {filtered.length === 0 && !loading ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
          Užsakymų nėra
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((o) => {
            const isOpen = expanded === o.id;
            const status = STATUS_LABELS[o.status];
            return (
              <div
                key={o.id}
                className="overflow-hidden rounded-lg border border-border bg-background/40"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50"
                >
                  <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="font-display text-lg tracking-wider text-primary">
                      #{o.order_number}
                    </span>
                    <span className="text-sm font-medium">{o.customer_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {fmtDate(o.created_at)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      {o.delivery_method === "delivery" ? "🚚" : "🏪"}
                      {o.delivery_method === "delivery"
                        ? `${o.distance_km?.toFixed(1)} km`
                        : "Atsiėmimas"}
                    </span>
                    <span className="font-display text-base text-primary">
                      {fmt(o.total)}
                    </span>
                    <Badge variant="outline" className={status.className}>
                      {status.label}
                    </Badge>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>

                {isOpen && (
                  <div className="space-y-3 border-t border-border bg-card/40 px-4 py-3 text-sm">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                          Kontaktai
                        </div>
                        <div className="space-y-1">
                          <div>{o.customer_name}</div>
                          <a
                            href={`tel:${o.customer_phone}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Phone className="h-3 w-3" />
                            {o.customer_phone}
                          </a>
                          <a
                            href={`mailto:${o.customer_email}`}
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            {o.customer_email}
                          </a>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                          {o.delivery_method === "delivery"
                            ? "Pristatymas"
                            : "Atsiėmimas"}
                        </div>
                        {o.delivery_method === "delivery" ? (
                          <div className="space-y-1">
                            <div className="flex items-start gap-1">
                              <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                              <div>
                                {o.address_street}
                                {o.address_apartment && `, but. ${o.address_apartment}`}
                                <br />
                                {o.address_city}
                                {o.address_door_code && (
                                  <>
                                    {" · "}
                                    <span className="text-primary">
                                      Kodas: {o.address_door_code}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            {o.address_lat && o.address_lng && (
                              <a
                                href={`https://www.google.com/maps?q=${o.address_lat},${o.address_lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline"
                              >
                                Atidaryti žemėlapyje →
                              </a>
                            )}
                            <div className="text-xs text-muted-foreground">
                              {o.distance_km?.toFixed(1)} km · pristatymas{" "}
                              {fmt(o.delivery_fee)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">
                            Klientas atvyks pasiimti
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
                        Užsakymas
                      </div>
                      <ul className="space-y-1">
                        {o.items.map((it, idx) => (
                          <li key={idx} className="flex justify-between gap-2">
                            <span>
                              {it.quantity}× {it.name}
                              {it.size && (
                                <span className="text-primary"> · {it.size}</span>
                              )}
                              {it.comment && (
                                <span className="block text-xs italic text-muted-foreground">
                                  „{it.comment}"
                                </span>
                              )}
                            </span>
                            <span>{fmt(it.unitPrice * it.quantity)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="grid gap-2 text-xs sm:grid-cols-3">
                      <div>
                        <span className="text-muted-foreground">Mokėjimas: </span>
                        <span className="font-medium">
                          {o.payment_method === "card_on_site"
                            ? "💳 Kortele"
                            : "💵 Grynais"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Įrankiai: </span>
                        <span className="font-medium">
                          {o.needs_utensils ? "Taip" : "Ne"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Suma: </span>
                        <span className="font-display text-primary">{fmt(o.total)}</span>
                      </div>
                    </div>

                    {o.comment && (
                      <div className="rounded-md border border-border bg-background/60 p-2 text-xs italic">
                        💬 {o.comment}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2 border-t border-border pt-3">
                      <Select
                        value={o.status}
                        onValueChange={(v) => updateStatus(o.id, v as OrderStatus)}
                      >
                        <SelectTrigger className="w-[160px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(
                            Object.keys(STATUS_LABELS) as OrderStatus[]
                          ).map((s) => (
                            <SelectItem key={s} value={s}>
                              {STATUS_LABELS[s].label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDetailOrder(o)}
                      >
                        <Package className="h-3 w-3" />
                        Spausdinti
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteOrder(o.id, o.order_number)}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Print dialog */}
      <Dialog open={!!detailOrder} onOpenChange={(o) => !o && setDetailOrder(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Užsakymas #{detailOrder?.order_number}</DialogTitle>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-3 text-sm print:text-black">
              <div>
                <strong>{detailOrder.customer_name}</strong> · {detailOrder.customer_phone}
              </div>
              <div className="text-xs text-muted-foreground">
                {fmtDate(detailOrder.created_at)}
              </div>
              <div>
                {detailOrder.delivery_method === "delivery" ? (
                  <>
                    <strong>🚚 Pristatymas:</strong> {detailOrder.address_street}
                    {detailOrder.address_apartment &&
                      `, but. ${detailOrder.address_apartment}`}
                    , {detailOrder.address_city}
                    {detailOrder.address_door_code && (
                      <> · Kodas: {detailOrder.address_door_code}</>
                    )}
                  </>
                ) : (
                  <strong>🏪 Atsiėmimas restorane</strong>
                )}
              </div>
              <ul className="space-y-1 border-t border-border pt-2">
                {detailOrder.items.map((it, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>
                      {it.quantity}× {it.name}
                      {it.size && ` (${it.size})`}
                    </span>
                    <span>{fmt(it.unitPrice * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t border-border pt-2 text-sm">
                <div className="flex justify-between">
                  <span>Prekės</span>
                  <span>{fmt(detailOrder.items_total)}</span>
                </div>
                {detailOrder.delivery_method === "delivery" && (
                  <div className="flex justify-between">
                    <span>Pristatymas</span>
                    <span>{fmt(detailOrder.delivery_fee)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold">
                  <span>VISO</span>
                  <span>{fmt(detailOrder.total)}</span>
                </div>
              </div>
              <div className="text-xs">
                Mokėjimas:{" "}
                {detailOrder.payment_method === "card_on_site"
                  ? "Kortele vietoje"
                  : "Grynais"}{" "}
                · Įrankiai: {detailOrder.needs_utensils ? "Taip" : "Ne"}
              </div>
              {detailOrder.comment && (
                <div className="rounded border border-border p-2 italic">
                  „{detailOrder.comment}"
                </div>
              )}
              <Button onClick={() => window.print()} className="w-full">
                Spausdinti
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
