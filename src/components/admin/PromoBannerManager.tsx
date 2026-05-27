import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Megaphone, Loader2, Trash2, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Banner = {
  id: string;
  message: string;
  bg_color: string;
  text_color: string;
  is_active: boolean;
};

export function PromoBannerManager() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("promo_banners")
      .select("*")
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setBanners((data ?? []) as Banner[]);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleActive(b: Banner) {
    // Tik vienas aktyvus banner'is — dezaktyvuojam kitus
    if (!b.is_active) {
      await supabase.from("promo_banners").update({ is_active: false }).neq("id", b.id);
    }
    const { error } = await supabase
      .from("promo_banners")
      .update({ is_active: !b.is_active })
      .eq("id", b.id);
    if (error) toast.error(error.message);
    else {
      toast.success(b.is_active ? "Banner'is išjungtas" : "Banner'is įjungtas");
      load();
    }
  }

  async function remove(b: Banner) {
    if (!confirm(`Ištrinti banner'į „${b.message}"?`)) return;
    const { error } = await supabase.from("promo_banners").delete().eq("id", b.id);
    if (error) toast.error(error.message);
    else {
      toast.success("Ištrinta");
      load();
    }
  }

  return (
    <section className="mb-8 rounded-lg border border-border bg-card/40 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 text-primary">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-lg tracking-wider">AKCIJŲ BANNER'IS</h2>
            <p className="text-xs text-muted-foreground">Rodomas svetainės viršuje. Aktyvus tik vienas vienu metu.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          Naujas
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : banners.length === 0 ? (
        <p className="py-4 text-center text-sm text-muted-foreground">Banner'ių nėra.</p>
      ) : (
        <ul className="space-y-2">
          {banners.map((b) => (
            <li
              key={b.id}
              className="flex items-center gap-3 rounded-md border border-border bg-background/40 p-3"
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-xs font-bold"
                style={{ backgroundColor: b.bg_color, color: b.text_color }}
              >
                A
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{b.message}</p>
                <p className="text-[10px] text-muted-foreground">
                  {b.is_active ? "🟢 AKTYVUS" : "Neaktyvus"}
                </p>
              </div>
              <Switch checked={b.is_active} onCheckedChange={() => toggleActive(b)} />
              <button
                type="button"
                onClick={() => setEditing(b)}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(b)}
                className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <BannerDialog
        open={creating || !!editing}
        banner={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSaved={load}
      />
    </section>
  );
}

function BannerDialog({
  open,
  banner,
  onClose,
  onSaved,
}: {
  open: boolean;
  banner: Banner | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [message, setMessage] = useState("");
  const [bgColor, setBgColor] = useState("#dc2626");
  const [textColor, setTextColor] = useState("#ffffff");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage(banner?.message ?? "");
      setBgColor(banner?.bg_color ?? "#dc2626");
      setTextColor(banner?.text_color ?? "#ffffff");
    }
  }, [open, banner]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    try {
      if (banner) {
        const { error } = await supabase
          .from("promo_banners")
          .update({ message, bg_color: bgColor, text_color: textColor })
          .eq("id", banner.id);
        if (error) throw error;
        toast.success("Atnaujinta");
      } else {
        const { error } = await supabase
          .from("promo_banners")
          .insert({ message, bg_color: bgColor, text_color: textColor, is_active: false });
        if (error) throw error;
        toast.success("Sukurta. Įjunkite jungikliu.");
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{banner ? "Redaguoti banner'į" : "Naujas akcijų banner'is"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="banner-msg">Pranešimas</Label>
            <Input
              id="banner-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Pvz. -20% picoms savaitgalį!"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="bg-color">Fono spalva</Label>
              <div className="flex gap-2">
                <input
                  id="bg-color"
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text-color">Teksto spalva</Label>
              <div className="flex gap-2">
                <input
                  id="text-color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded border border-border bg-transparent"
                />
                <Input value={textColor} onChange={(e) => setTextColor(e.target.value)} />
              </div>
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-xs">Peržiūra</Label>
            <div
              className="rounded p-3 text-center text-sm font-medium"
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {message || "Jūsų pranešimas..."}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Atšaukti
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Saugoma..." : "Išsaugoti"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
