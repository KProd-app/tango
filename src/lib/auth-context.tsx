import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  dbError: string | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    let active = true;

    // Fallback timeout to ensure we never lock the UI in loading state forever
    const timer = setTimeout(() => {
      if (active) {
        console.warn("DEBUG: Auth initialization fallback timeout reached. Forcing authInitialized = true");
        setAuthInitialized(true);
      }
    }, 4000);

    // Set up auth listener (in Supabase v2, this fires INITIAL_SESSION immediately)
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      console.log("DEBUG: onAuthStateChange event:", event, "Session:", !!s);
      if (!active) return;

      setSession(s);
      setAuthInitialized(true);
      clearTimeout(timer);
    });

    return () => {
      active = false;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!authInitialized) return;

    let active = true;

    async function runCheck() {
      if (session?.user) {
        setLoading(true);
        try {
          await checkAdmin(session.user.id);
        } catch (e) {
          console.error("Auth listener admin check error:", e);
          setDbError(e instanceof Error ? e.message : "Sistemos klaida");
        } finally {
          if (active) {
            setLoading(false);
          }
        }
      } else {
        setIsAdmin(false);
        setDbError(null);
        setLoading(false);
      }
    }

    runCheck();

    return () => {
      active = false;
    };
  }, [session, authInitialized]);

  async function checkAdmin(userId: string) {
    console.log("DEBUG: Starting checkAdmin for user:", userId);
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();

      if (error) {
        console.error("DEBUG: checkAdmin database error:", error);
        setDbError(`DB Klaida: ${error.message} (Kodas: ${error.code})`);
        setIsAdmin(false);
      } else {
        console.log("DEBUG: checkAdmin database result:", data);
        if (data) {
          setIsAdmin(true);
          setDbError(null);
        } else {
          setIsAdmin(false);
          setDbError("Vaidmuo nerastas (vartotojo ID nėra user_roles lentelėje su 'admin' role)");
        }
      }
    } catch (err) {
      console.error("DEBUG: checkAdmin exception:", err);
      setDbError(err instanceof Error ? err.message : "Užklausos klaida");
      setIsAdmin(false);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, isAdmin, loading, signOut, dbError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
