import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, Clock, ChefHat, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-status/$id")({
  component: OrderStatusPage,
});

type OrderItem = {
  name: string;
  quantity: number;
  size?: string;
  unitPrice: number;
};

type Order = {
  id: string;
  order_number: number;
  customer_name: string;
  customer_phone: string;
  delivery_method: "delivery" | "pickup";
  address_street: string | null;
  address_apartment: string | null;
  address_city: string | null;
  status: string;
  delivery_time: number | null;
  cancel_reason: string | null;
  total: number;
  items: OrderItem[];
  created_at: string;
};

function OrderStatusPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data, error: fetchErr } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (fetchErr) throw fetchErr;
        if (!data) throw new Error("Užsakymas nerastas");

        setOrder({
          ...data,
          items: (data.items as any) || [],
        } as Order);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Klaida užkraunant užsakymą");
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();

    // Subscribe to Postgres changes for this specific order ID
    const channel = supabase
      .channel(`order-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          const updatedOrder = payload.new as any;
          if (updatedOrder) {
            setOrder((prev) =>
              prev
                ? {
                    ...prev,
                    status: updatedOrder.status,
                    delivery_time: updatedOrder.delivery_time,
                    cancel_reason: updatedOrder.cancel_reason,
                  }
                : null
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground">Užkraunamas užsakymas...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h1 className="mt-4 font-display text-2xl tracking-wider text-foreground">KLAIDA</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error || "Užsakymas nerastas."}</p>
        <Button asChild className="mt-6">
          <Link to="/">Grįžti į pradžią</Link>
        </Button>
      </div>
    );
  }

  const { status, delivery_time, order_number } = order;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <ChefHat className="h-6 w-6 text-primary" />
            <span className="font-display text-xl tracking-wider">TANGO</span>
          </Link>
          <span className="font-mono text-sm text-muted-foreground">
            Užsakymas #{order_number}
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:px-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-gradient-to-br from-card/80 to-card/30 p-8 shadow-2xl backdrop-blur-md">
          {status === "LAUKIA_PATVIRTINIMO" && (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/20 opacity-75"></span>
                <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
                  <Clock className="h-8 w-8 animate-pulse text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl tracking-wider text-primary uppercase">
                  Laukiama patvirtinimo
                </h2>
                <p className="text-sm text-muted-foreground">
                  Laukiame, kol restoranas patvirtins užsakymą ir nurodys tikslų laiką.
                </p>
              </div>
              <div className="w-full border-t border-border/40 pt-4 text-xs text-muted-foreground">
                Šis langas atsinaujins automatiškai
              </div>
            </div>
          )}

          {status === "PATVIRTINTAS" && (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="h-10 w-10 text-green-400" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl tracking-wider text-green-400 uppercase">
                  Užsakymas priimtas!
                </h2>
                <div className="rounded-lg bg-green-500/5 border border-green-500/10 p-4">
                  <p className="text-sm text-muted-foreground">
                    Maistas bus ruošiamas ir pristatomas. Numatomas laikas:
                  </p>
                  <p className="font-display text-4xl text-green-400 mt-1">
                    {delivery_time ?? 45} min.
                  </p>
                </div>
              </div>
              <div className="w-full border-t border-border/40 pt-4 text-xs text-muted-foreground">
                Skanaus! Netrukus pradėsime ruošti.
              </div>
            </div>
          )}

          {status !== "LAUKIA_PATVIRTINIMO" && status !== "PATVIRTINTAS" && (
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border border-primary/30">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-2xl tracking-wider text-primary uppercase">
                  Užsakymo būsena
                </h2>
                <div className="rounded-lg bg-card border border-border p-4">
                  <p className="text-sm font-semibold capitalize text-primary">
                    {status === "new" && "Gautas užsakymas"}
                    {status === "preparing" && "Ruošiamas maistas"}
                    {status === "delivering" && "Maistas jau pakeliui"}
                    {status === "completed" && "Užsakymas sėkmingai įvykdytas"}
                    {status === "cancelled" && "Užsakymas buvo atšauktas"}
                    {status !== "new" && status !== "preparing" && status !== "delivering" && status !== "completed" && status !== "cancelled" && status}
                  </p>
                  {delivery_time && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Numatytas laikas: {delivery_time} min.
                    </p>
                  )}
                  {status === "cancelled" && order.cancel_reason && (
                    <div className="mt-3 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-left">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Atšaukimo priežastis:</p>
                      <p className="text-xs text-destructive mt-1 font-medium italic break-words">
                        {order.cancel_reason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-full border-t border-border/40 pt-4 text-xs text-muted-foreground">
                Jeigu kils klausimų, susisiekite su mumis.
              </div>
            </div>
          )}

          {/* Order Details Brief */}
          <div className="mt-8 border-t border-border/60 pt-6 space-y-4 text-xs">
            <div className="flex justify-between font-mono">
              <span className="text-muted-foreground">Klientas:</span>
              <span className="font-semibold text-right">{order.customer_name}</span>
            </div>
            <div className="flex justify-between font-mono">
              <span className="text-muted-foreground">Telefonas:</span>
              <a href={`tel:${order.customer_phone}`} className="font-semibold text-primary hover:underline text-right">
                {order.customer_phone}
              </a>
            </div>
            {order.delivery_method === "delivery" && order.address_street && (
              <div className="flex justify-between font-mono">
                <span className="text-muted-foreground">Adresas:</span>
                <span className="font-semibold text-right max-w-[200px] truncate">
                  {order.address_street}, {order.address_city}
                </span>
              </div>
            )}
            <div className="flex justify-between font-mono">
              <span className="text-muted-foreground">Būdas:</span>
              <span className="font-semibold text-right">
                {order.delivery_method === "delivery" ? "🚚 Pristatymas" : "🏪 Atsiėmimas"}
              </span>
            </div>
            <div className="flex justify-between font-mono border-t border-border/30 pt-3 text-sm">
              <span className="font-semibold text-muted-foreground">Viso mokėti:</span>
              <span className="font-display text-primary text-base">
                {order.total.toFixed(2).replace(".", ",")} €
              </span>
            </div>
          </div>
        </div>

        <Button asChild variant="outline" className="mt-8">
          <Link to="/">Atgal į meniu</Link>
        </Button>
      </main>
    </div>
  );
}
