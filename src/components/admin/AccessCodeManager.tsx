import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getAccessCode, updateAccessCode } from "@/lib/code-auth.functions";
import { authHeaders } from "@/lib/auth-headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

export function AccessCodeManager() {
  const getFn = useServerFn(getAccessCode);
  const updateFn = useServerFn(updateAccessCode);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await getFn({ headers: await authHeaders() });
        setCode(r.code);
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Klaida");
      } finally {
        setLoading(false);
      }
    })();
  }, [getFn]);

  async function save() {
    setSaving(true);
    try {
      await updateFn({ data: { code: code.trim() }, headers: await authHeaders() });
      toast.success("Prieigos kodas atnaujintas");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Klaida");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-2">
        <KeyRound className="h-5 w-5 text-primary" />
        <h2 className="font-display text-lg tracking-wider">PRIEIGOS KODAS</h2>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        Kodas, kurį reikia įvesti prisijungimo puslapyje, kad patektum į admin panelę.
      </p>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="access-code">Kodas</Label>
            <div className="relative">
              <Input
                id="access-code"
                type={show ? "text" : "password"}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Įveskite naują kodą"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Tik raidės, skaičiai, _ ir -. Ne mažiau kaip 4 simboliai.
            </p>
          </div>
          <Button onClick={save} disabled={saving || code.trim().length < 4}>
            {saving ? "Saugoma..." : "Išsaugoti"}
          </Button>
        </div>
      )}
    </section>
  );
}
