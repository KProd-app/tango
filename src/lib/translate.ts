import { supabase } from "@/integrations/supabase/client";

export type LangCode = "en" | "fr" | "pl" | "ru" | "es";

export async function translateLt(
  text: string,
  targetLangs: LangCode[] = ["en", "fr", "pl", "ru", "es"],
): Promise<Partial<Record<LangCode, string>>> {
  const trimmed = text?.trim();
  if (!trimmed) return {};
  const { data, error } = await supabase.functions.invoke("translate-text", {
    body: { text: trimmed, targetLangs },
  });
  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);
  return (data?.translations ?? {}) as Partial<Record<LangCode, string>>;
}
