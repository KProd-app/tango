import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/context";

const STORAGE_KEY = "tango-cookie-consent";

export function CookieBanner() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const id = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(id);
    }
  }, []);

  function handleChoice(value: "accepted" | "essential") {
    localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[60] mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-4">
      <div className="rounded-xl border border-border bg-background/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Cookie className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-lg tracking-wider text-foreground">
              {t.cookies.title}
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground md:text-sm">
              {t.cookies.description}{" "}
              <Link
                to="/privatumo-politika"
                className="text-primary underline-offset-2 hover:underline"
              >
                {t.cookies.learnMore}
              </Link>
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button
                size="sm"
                onClick={() => handleChoice("accepted")}
                className="bg-primary hover:bg-primary/90"
              >
                {t.cookies.accept}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleChoice("essential")}
                className="border-border"
              >
                {t.cookies.decline}
              </Button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleChoice("essential")}
            className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
