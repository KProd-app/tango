import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Banner = {
  id: string;
  message: string;
  bg_color: string;
  text_color: string;
};

export function PromoBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("promo_banners")
        .select("id, message, bg_color, text_color")
        .eq("is_active", true)
        .order("updated_at", { ascending: false })
        .limit(1);
      if (!cancelled && data && data.length > 0) {
        const b = data[0];
        const dismissedId = typeof window !== "undefined" ? sessionStorage.getItem("tango-banner-dismissed") : null;
        if (dismissedId !== b.id) {
          setBanner(b);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!banner || dismissed) return null;

  function handleDismiss() {
    if (banner) sessionStorage.setItem("tango-banner-dismissed", banner.id);
    setDismissed(true);
  }

  return (
    <div
      className="relative z-[55] px-4 py-2.5 text-center text-sm font-medium"
      style={{ backgroundColor: banner.bg_color, color: banner.text_color }}
    >
      <span>{banner.message}</span>
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 opacity-70 hover:opacity-100"
        aria-label="Close"
        style={{ color: banner.text_color }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
