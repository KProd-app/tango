import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { loginWithCode } from "@/lib/code-auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ChefHat, ArrowLeft } from "lucide-react";

// Slaptas raktas — prisijungimas pasiekiamas tik per /auth?key=tango7p9q2x
const AUTH_ACCESS_KEY = "tango7p9q2x";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  validateSearch: (search: Record<string, unknown>) => ({
    key: typeof search.key === "string" ? search.key : "",
  }),
  head: () => ({
    meta: [
      { title: "Prisijungimas — Tango Pizza & Grill" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const { key } = Route.useSearch();
  const { session, isAdmin, loading } = useAuth();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [debugStatus, setDebugStatus] = useState("");
  const loginFn = useServerFn(loginWithCode);

  useEffect(() => {
    // Saugi Supabase kliento informacijos diagnostika konsolėje
    try {
      const clientUrl = (supabase as any).supabaseUrl || "";
      const clientKey = (supabase as any).supabaseKey || "";
      console.log("DEBUG: Supabase Client URL:", JSON.stringify(clientUrl));
      console.log("DEBUG: Supabase Client Key length:", clientKey.length);
      console.log("DEBUG: Supabase Client Key has trailing spaces:", /\s/.test(clientKey));
    } catch (e) {
      console.error("DEBUG: Error checking client variables:", e);
    }
  }, []);

  useEffect(() => {
    console.log("Auth state updated. Loading:", loading, "Session:", !!session, "IsAdmin:", isAdmin);
    if (!loading) {
      if (session && isAdmin) {
        setDebugStatus("Turite sesiją ir admin teises. Nukreipiama...");
        navigate({ to: "/admin" });
      } else if (session) {
        setDebugStatus(`Prisijungta kaip ${session.user.email}, bet neturite administratoriaus teisių duomenų bazėje.`);
      } else {
        setDebugStatus("Sesijos nėra. Įveskite prieigos kodą.");
      }
    } else {
      setDebugStatus("Tikrinama sesija...");
    }
  }, [loading, session, isAdmin, navigate]);

  if (key !== AUTH_ACCESS_KEY) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="font-display text-6xl tracking-wider text-muted-foreground">404</h1>
          <p className="mt-4 text-sm text-muted-foreground">Puslapis nerastas</p>
          <Link to="/" className="mt-6 inline-block text-sm text-primary hover:underline">
            Grįžti į pradžią
          </Link>
        </div>
      </div>
    );
  }

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setDebugStatus("Jungiamasi... Prašome palaukti.");
    try {
      setDebugStatus("1/3 Tikrinamas kodas su serverio funkcija...");
      const creds = await loginFn({ data: { code: code.trim() } });
      
      setDebugStatus("2/3 Jungiamasi prie Supabase auth...");
      console.log("Got credentials from server function");

      const { data, error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      });

      if (error) {
        console.error("Supabase signInWithPassword error:", error);
        throw error;
      }

      setDebugStatus("3/3 Laukiama vaidmens patvirtinimo...");
      console.log("Supabase signInWithPassword success. Session:", !!data.session);

      // Palaukiame sekundę, kol suveiks AuthProvider būsena
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Sėkmingai prisijungta");
    } catch (err) {
      console.error("Login process exception:", err);
      const msg = err instanceof Error ? err.message : "Prisijungimo klaida";
      setDebugStatus(`Klaida: ${msg}`);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Atgal į meniu
        </Link>

        <div className="rounded-lg border border-border bg-card p-8 shadow-2xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 inline-flex rounded-full bg-primary/10 p-3">
              <ChefHat className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-3xl tracking-wider">PRISIJUNGIMAS</h1>
            <p className="mt-2 text-sm text-muted-foreground">Įveskite prieigos kodą</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Kodas</Label>
              <Input
                id="code"
                type="password"
                inputMode="numeric"
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="••••••••"
                className="text-center text-lg tracking-[0.4em]"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={busy}
            >
              {busy ? "Palaukite..." : "Prisijungti"}
            </Button>
          </form>

          {debugStatus && (
            <div className="mt-4 p-3 rounded bg-muted/50 border border-border/50 text-center text-xs text-muted-foreground font-mono break-all whitespace-pre-wrap">
              {debugStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
