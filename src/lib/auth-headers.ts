import { supabase } from "@/integrations/supabase/client";

// Returns headers with the current user's Supabase access token attached.
// Used to authenticate server function calls that require requireSupabaseAuth middleware.
export async function authHeaders(): Promise<HeadersInit> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Nesate prisijungę");
  return { Authorization: `Bearer ${token}` };
}
