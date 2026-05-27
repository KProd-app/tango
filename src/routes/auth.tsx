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
  const loginFn = useServerFn(loginWithCode);

  useEffect(() => {
    if (!loading && session && isAdmin) {
      navigate({ to: "/admin" });
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
    try {
      const creds = await loginFn({ data: { code: code.trim() } });
      const { error } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      });
      if (error) throw error;
      toast.success("Sėkmingai prisijungta");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida");
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
        </div>
      </div>
    </div>
  );
}
