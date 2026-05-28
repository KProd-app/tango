import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
  Volume2,
  VolumeX,
  AlertTriangle,
  Clock,
} from "lucide-react";

// Custom sound alarm manager using Web Audio API
class AudioAlarm {
  private ctx: AudioContext | null = null;
  private intervalId: number | null = null;
  private clickListener: (() => void) | null = null;

  start() {
    if (this.intervalId) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();

    this.intervalId = window.setInterval(() => {
      this.beep();
    }, 1500);

    // Auto-resume AudioContext on first user interaction if suspended
    this.clickListener = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch((err) => console.error("Error resuming AudioContext:", err));
      }
    };
    window.addEventListener("click", this.clickListener, { once: true });
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.clickListener) {
      window.removeEventListener("click", this.clickListener);
      this.clickListener = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  private beep() {
    if (!this.ctx || this.ctx.state === "suspended") return;
    try {
      const playBeep = (timeOffset: number, freq: number, duration: number) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx!.currentTime + timeOffset);
        gain.gain.setValueAtTime(0.15, this.ctx!.currentTime + timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx!.currentTime + timeOffset + duration);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(this.ctx!.currentTime + timeOffset);
        osc.stop(this.ctx!.currentTime + timeOffset + duration);
      };
      playBeep(0, 880, 0.15);
      playBeep(0.2, 880, 0.15);
    } catch (e) {
      console.error("Audio error:", e);
    }
  }
}

type OrderStatus = "LAUKIA_PATVIRTINIMO" | "PATVIRTINTAS" | "new" | "preparing" | "delivering" | "completed" | "cancelled";
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
  delivery_time: number | null;
  cancel_reason: string | null;
  created_at: string;
};
 
const STATUS_LABELS: Record<OrderStatus, { label: string; className: string }> = {
  LAUKIA_PATVIRTINIMO: {
    label: "Laukia patvirtinimo",
    className: "bg-orange-500/20 text-orange-300 border-orange-500/40 animate-pulse font-bold",
  },
  PATVIRTINTAS: {
    label: "Patvirtintas",
    className: "bg-green-500/20 text-green-300 border-green-500/40 font-semibold",
  },
  new: { label: "Gautas", className: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
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

const REJECTION_REASONS = [
  "Atsiprašome, neturime reikiamų ingredientų šiam patiekalui.",
  "Atsiprašome, restoranas šiuo metu perpildytas ir nespės laiku paruošti užsakymo.",
  "Atsiprašome, šiuo metu nedirba pristatymo kurjeris.",
  "Neteisingi kliento duomenys (telefono numeris ar adresas).",
  "Kita priežastis..."
];

export function OrdersManager() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
 
  // Sound alarm states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [alarmActive, setAlarmActive] = useState(false);
 
  // Tablet confirmation modal states
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [deliveryTimeMinutes, setDeliveryTimeMinutes] = useState<number>(45);
  const [customTime, setCustomTime] = useState<string>("");
  const [confirming, setConfirming] = useState(false);

  // Rejection reason states
  const [rejectOrder, setRejectOrder] = useState<Order | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>(REJECTION_REASONS[0]);
  const [customReason, setCustomReason] = useState<string>("");

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
 
  // Watch orders to trigger alarm
  useEffect(() => {
    const hasPending = orders.some((o) => o.status === "LAUKIA_PATVIRTINIMO");
    setAlarmActive(hasPending);
  }, [orders]);
 
  // Handle alarm sound repetitions
  useEffect(() => {
    let alarm: AudioAlarm | null = null;
    if (soundEnabled && alarmActive) {
      alarm = new AudioAlarm();
      alarm.start();
    }
    return () => {
      if (alarm) alarm.stop();
    };
  }, [soundEnabled, alarmActive]);
 
  // Handle auto-opening of the oldest pending order modal
  useEffect(() => {
    if (!confirmOrder) {
      const pendingOrders = orders.filter((o) => o.status === "LAUKIA_PATVIRTINIMO");
      if (pendingOrders.length > 0) {
        // Oldest is at the end (since orders are ordered desc by created_at)
        const oldest = pendingOrders[pendingOrders.length - 1];
        setConfirmOrder(oldest);
        setDeliveryTimeMinutes(45);
        setCustomTime("");
      }
    } else {
      const stillPending = orders.find(
        (o) => o.id === confirmOrder.id && o.status === "LAUKIA_PATVIRTINIMO"
      );
      if (!stillPending) {
        setConfirmOrder(null);
      }
    }
  }, [orders, confirmOrder]);

  async function updateStatus(id: string, status: OrderStatus) {
    if (status === "cancelled") {
      const o = orders.find((ord) => ord.id === id);
      if (o) {
        setRejectOrder(o);
        setSelectedReason(REJECTION_REASONS[0]);
        setCustomReason("");
        return;
      }
    }
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success(`Statusas: ${STATUS_LABELS[status].label}`);
  }

  async function handleConfirmOrder() {
    if (!confirmOrder) return;
    setConfirming(true);
    const finalMinutes = customTime ? parseInt(customTime, 10) : deliveryTimeMinutes;
    if (isNaN(finalMinutes) || finalMinutes <= 0) {
      toast.error("Įveskite tinkamą laiką minutėmis");
      setConfirming(false);
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({
        status: "PATVIRTINTAS",
        delivery_time: finalMinutes,
      } as any)
      .eq("id", confirmOrder.id);
 
    setConfirming(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(`Užsakymas #${confirmOrder.order_number} patvirtintas! Laikas: ${finalMinutes} min.`);
      setConfirmOrder(null);
    }
  }
 
  async function handleConfirmRejection() {
    if (!rejectOrder) return;
    setConfirming(true);
    const finalReason = selectedReason === "Kita priežastis..." ? customReason.trim() : selectedReason;
    if (!finalReason) {
      toast.error("Prašome pasirinkti arba įrašyti atmetimo priežastį");
      setConfirming(false);
      return;
    }
    const { error } = await supabase
      .from("orders")
      .update({
        status: "cancelled",
        cancel_reason: finalReason,
      } as any)
      .eq("id", rejectOrder.id);
 
    setConfirming(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.error(`Užsakymas #${rejectOrder.order_number} atmestas.`);
      setRejectOrder(null);
      if (confirmOrder && confirmOrder.id === rejectOrder.id) {
        setConfirmOrder(null);
      }
    }
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
    LAUKIA_PATVIRTINIMO: 0,
    PATVIRTINTAS: 0,
    new: 0,
    preparing: 0,
    delivering: 0,
    completed: 0,
    cancelled: 0,
  };
  for (const o of orders) {
    if (counts[o.status] !== undefined) counts[o.status]++;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl tracking-wider">UŽSAKYMAI</h2>
          <Badge variant="secondary" className="ml-1">
            {counts.all}
          </Badge>
          {counts.LAUKIA_PATVIRTINIMO > 0 && (
            <Badge className="bg-orange-500/20 text-orange-300 animate-pulse border-orange-500/40">
              {counts.LAUKIA_PATVIRTINIMO} laukia patvirtinimo
            </Badge>
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
              <SelectItem value="LAUKIA_PATVIRTINIMO">Laukia patvirtinimo ({counts.LAUKIA_PATVIRTINIMO})</SelectItem>
              <SelectItem value="PATVIRTINTAS">Patvirtinti ({counts.PATVIRTINTAS})</SelectItem>
              <SelectItem value="new">Gauti ({counts.new})</SelectItem>
              <SelectItem value="preparing">Ruošiami ({counts.preparing})</SelectItem>
              <SelectItem value="delivering">
                Pristatomi ({counts.delivering})
              </SelectItem>
              <SelectItem value="completed">Įvykdyti ({counts.completed})</SelectItem>
              <SelectItem value="cancelled">Atšaukti ({counts.cancelled})</SelectItem>
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`gap-2 ${soundEnabled ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
            title="Įgalinti garsinius pranešimus apie naujus užsakymus"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">
              {soundEnabled ? "Garsas įjungtas" : "Garsas išjungtas"}
            </span>
          </Button>
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
                    {o.delivery_time && (
                      <span className="flex items-center gap-1 text-xs text-green-400 font-mono">
                        ⏱️ {o.delivery_time} min
                      </span>
                    )}
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

                    {o.status === "cancelled" && o.cancel_reason && (
                      <div className="rounded-md border border-red-500/20 bg-red-500/5 p-2 text-xs text-red-300">
                        ❌ Atmetimo priežastis: {o.cancel_reason}
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
 
      {/* Tablet Confirmation Modal */}
      <Dialog open={!!confirmOrder} onOpenChange={() => {}}>
        <DialogContent className="max-w-xl bg-card border-orange-500/30">
          <DialogHeader>
            <div className="flex items-center gap-2 text-orange-400">
              <AlertTriangle className="h-6 w-6 animate-pulse" />
              <DialogTitle className="font-display text-2xl tracking-wider uppercase">
                NAUJAS UŽSAKYMAS #{confirmOrder?.order_number}
              </DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground">
              Prašome peržiūrėti užsakymo detales ir pasirinkti pristatymo / paruošimo laiką.
            </DialogDescription>
          </DialogHeader>
 
          {confirmOrder && (
            <div className="space-y-4 py-2">
              {/* Customer and Delivery info */}
              <div className="grid gap-3 rounded-lg bg-background/50 border border-border p-4 text-sm sm:grid-cols-2">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Klientas</div>
                  <div className="font-semibold text-foreground text-base">{confirmOrder.customer_name}</div>
                  <a href={`tel:${confirmOrder.customer_phone}`} className="flex items-center gap-1 text-primary hover:underline mt-1 font-mono">
                    <Phone className="h-3.5 w-3.5" />
                    {confirmOrder.customer_phone}
                  </a>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    {confirmOrder.delivery_method === "delivery" ? "🚚 Pristatymas" : "🏪 Atsiėmimas"}
                  </div>
                  {confirmOrder.delivery_method === "delivery" ? (
                    <div>
                      <div className="font-semibold text-foreground">
                        {confirmOrder.address_street}
                        {confirmOrder.address_apartment && `, but. ${confirmOrder.address_apartment}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {confirmOrder.address_city} {confirmOrder.address_door_code && `· durų kodas: ${confirmOrder.address_door_code}`}
                      </div>
                    </div>
                  ) : (
                    <div className="font-semibold text-orange-300">Pasiims pats restorane</div>
                  )}
                </div>
              </div>
 
              {/* Order items */}
              <div className="rounded-lg border border-border p-4 bg-background/30 text-sm">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Užsakyti patiekalai</div>
                <ul className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  {confirmOrder.items.map((it, idx) => (
                    <li key={idx} className="flex justify-between items-start gap-2 border-b border-border/20 pb-1.5 last:border-0 last:pb-0">
                      <div>
                        <span className="font-bold text-foreground">{it.quantity}×</span> {it.name}
                        {it.size && <span className="text-primary text-xs ml-1">({it.size})</span>}
                        {it.comment && <div className="text-xs italic text-muted-foreground mt-0.5">„{it.comment}“</div>}
                      </div>
                      <span className="font-mono text-foreground">{fmt(it.unitPrice * it.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between font-bold border-t border-border/30 pt-3 mt-3 text-base text-foreground">
                  <span>VISO</span>
                  <span className="text-primary font-display text-lg">{fmt(confirmOrder.total)}</span>
                </div>
              </div>
 
              {/* Note / Comments */}
              {confirmOrder.comment && (
                <div className="rounded border border-dashed border-orange-500/20 bg-orange-500/5 p-3 text-xs italic text-orange-200">
                  💬 Komentaras: {confirmOrder.comment}
                </div>
              )}
 
              {/* Time selection */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-semibold uppercase tracking-wider text-foreground">
                  Paruošimo / Pristatymo laikas (minutėmis) *
                </Label>
                <div className="grid grid-cols-5 gap-2">
                  {[20, 30, 45, 60, 90].map((t) => (
                    <Button
                      key={t}
                      type="button"
                      variant={deliveryTimeMinutes === t && !customTime ? "default" : "outline"}
                      onClick={() => {
                        setDeliveryTimeMinutes(t);
                        setCustomTime("");
                      }}
                      className="h-12 text-sm font-semibold"
                    >
                      {t} min
                    </Button>
                  ))}
                </div>
 
                <div className="flex items-center gap-3 pt-1">
                  <Label htmlFor="custom-time" className="text-xs text-muted-foreground shrink-0">
                    Kitas laikas (min):
                  </Label>
                  <Input
                    id="custom-time"
                    type="number"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="Pvz. 40, 50, 120"
                    className="h-9 w-32 font-mono"
                  />
                </div>
              </div>
            </div>
          )}
 
          <DialogFooter className="gap-2 sm:gap-0 mt-4 border-t border-border pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setRejectOrder(confirmOrder);
                setSelectedReason(REJECTION_REASONS[0]);
                setCustomReason("");
              }}
              disabled={confirming}
              className="text-muted-foreground hover:bg-destructive hover:text-destructive-foreground mr-auto"
            >
              Atmesti
            </Button>
            <Button
              onClick={handleConfirmOrder}
              disabled={confirming}
              className="bg-green-600 hover:bg-green-700 text-white font-bold tracking-wider uppercase px-6"
            >
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saugoma...
                </>
              ) : (
                "Patvirtinti užsakymą"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog open={!!rejectOrder} onOpenChange={(open) => !open && setRejectOrder(null)}>
        <DialogContent className="max-w-md bg-card border-red-500/20">
          <DialogHeader>
            <DialogTitle className="font-display text-xl tracking-wider text-red-400 uppercase">
              ATMESTI UŽSAKYMĄ #{rejectOrder?.order_number}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Pasirinkite arba įrašykite priežastį. Ji bus matoma klientui.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              {REJECTION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background/30 p-3 hover:bg-background/70 cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="rejection-reason"
                    checked={selectedReason === reason}
                    onChange={() => setSelectedReason(reason)}
                    className="mt-1 accent-primary"
                  />
                  <span className="text-sm font-medium text-foreground">{reason}</span>
                </label>
              ))}
            </div>

            {selectedReason === "Kita priežastis..." && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason" className="text-xs text-muted-foreground">
                  Įrašykite savo priežastį lietuviškai:
                </Label>
                <Input
                  id="custom-reason"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="pvz., restoranas užsidaro anksčiau dėl techninių kliūčių"
                  className="w-full text-sm"
                  required
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0 border-t border-border pt-4">
            <Button
              variant="outline"
              onClick={() => setRejectOrder(null)}
              disabled={confirming}
            >
              Atšaukti
            </Button>
            <Button
              onClick={handleConfirmRejection}
              disabled={confirming || (selectedReason === "Kita priežastis..." && !customReason.trim())}
              className="bg-red-600 hover:bg-red-700 text-white font-bold"
            >
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Atmetama...
                </>
              ) : (
                "Patvirtinti atmetimą"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
