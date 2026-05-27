import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, KeyRound, Shield, User as UserIcon } from "lucide-react";
import {
  createUser,
  listUsers,
  deleteUser,
  resetUserPassword,
} from "@/lib/admin-users.functions";
import { authHeaders } from "@/lib/auth-headers";

type AdminUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null | undefined;
  roles: string[];
};

export function UserManager({ currentUserId }: { currentUserId: string | undefined }) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [resetForUser, setResetForUser] = useState<AdminUser | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await listUsers({ headers: await authHeaders() });
      setUsers(res.users);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida kraunant vartotojus");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(u: AdminUser) {
    if (!confirm(`Ištrinti vartotoją ${u.email}?`)) return;
    try {
      await deleteUser({ data: { userId: u.id }, headers: await authHeaders() });
      toast.success("Vartotojas ištrintas");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida");
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wider">VARTOTOJAI</h2>
          <p className="text-xs text-muted-foreground">
            Tvarkykite admin panelės narius
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4" />
          Naujas vartotojas
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => {
            const isAdminUser = u.roles.includes("admin");
            const isSelf = u.id === currentUserId;
            return (
              <div
                key={u.id}
                className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-background/50 p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  {isAdminUser ? (
                    <Shield className="h-4 w-4 text-primary" />
                  ) : (
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {u.email}
                    {isSelf && (
                      <span className="ml-2 text-[10px] uppercase tracking-wider text-primary">
                        (jūs)
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {isAdminUser ? "Administratorius" : "Vartotojas"}
                    {u.last_sign_in_at &&
                      ` · paskut. prisijungimas ${new Date(u.last_sign_in_at).toLocaleDateString("lt-LT")}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setResetForUser(u)}
                    title="Keisti slaptažodį"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(u)}
                    disabled={isSelf}
                    title={isSelf ? "Negalite ištrinti savęs" : "Ištrinti"}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
          {users.length === 0 && (
            <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Vartotojų nėra.
            </div>
          )}
        </div>
      )}

      <CreateUserDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={load}
      />
      <ResetPasswordDialog
        user={resetForUser}
        onClose={() => setResetForUser(null)}
      />
    </div>
  );
}

function CreateUserDialog({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setIsAdmin(false);
    }
  }, [open]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await createUser({ data: { email, password, isAdmin }, headers: await authHeaders() });
      toast.success("Vartotojas sukurtas");
      onCreated();
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
          <DialogTitle>Naujas vartotojas</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">El. paštas</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Slaptažodis (min. 8 simboliai)</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="flex items-center justify-between rounded-md border border-border bg-background/50 p-3">
            <div>
              <Label htmlFor="is-admin" className="text-sm">
                Administratorius
              </Label>
              <p className="text-xs text-muted-foreground">
                Suteikti pilną prieigą prie admin panelės
              </p>
            </div>
            <Switch id="is-admin" checked={isAdmin} onCheckedChange={setIsAdmin} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Atšaukti
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Kuriama..." : "Sukurti"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ResetPasswordDialog({
  user,
  onClose,
}: {
  user: AdminUser | null;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) setPassword("");
  }, [user]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    try {
      await resetUserPassword({ data: { userId: user.id, newPassword: password }, headers: await authHeaders() });
      toast.success("Slaptažodis pakeistas");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Klaida");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={!!user} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keisti slaptažodį</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vartotojas: <span className="font-medium text-foreground">{user?.email}</span>
          </p>
          <div className="space-y-2">
            <Label htmlFor="reset-pw">Naujas slaptažodis</Label>
            <Input
              id="reset-pw"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={busy}>
              Atšaukti
            </Button>
            <Button type="submit" disabled={busy}>
              {busy ? "Keičiama..." : "Pakeisti"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
