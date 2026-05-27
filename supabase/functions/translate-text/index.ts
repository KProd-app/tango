// Auto-translate Lithuanian text to multiple languages via AI gateway
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const { text, targetLangs } = await req.json();
    if (!text || typeof text !== "string" || !text.trim()) {
      return new Response(JSON.stringify({ translations: {} }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }
    const langs: string[] = Array.isArray(targetLangs) && targetLangs.length
      ? targetLangs
      : ["en", "fr", "pl", "ru", "es"];

    const AI_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!AI_API_KEY) throw new Error("AI API key not configured");

    const langNames: Record<string, string> = {
      en: "English",
      fr: "French",
      pl: "Polish",
      ru: "Russian",
      es: "Spanish",
    };

    const prompt = `Translate the following Lithuanian restaurant menu text into these languages: ${langs
      .map((l) => langNames[l] ?? l)
      .join(", ")}.
Return ONLY a strict JSON object with language codes as keys (${langs.join(", ")}) and translations as values. No explanations.

Text: "${text}"`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a professional menu translator. Output only valid JSON." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      if (r.status === 429)
        return new Response(JSON.stringify({ error: "Per daug užklausų, pabandykite vėliau" }), {
          status: 429,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      if (r.status === 402)
        return new Response(JSON.stringify({ error: "Reikia papildyti AI kreditus" }), {
          status: 402,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      throw new Error(`AI gateway: ${r.status} ${errText}`);
    }

    const data = await r.json();
    const content: string = data.choices?.[0]?.message?.content ?? "{}";
    const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
    let translations: Record<string, string> = {};
    try {
      translations = JSON.parse(cleaned);
    } catch {
      const m = cleaned.match(/\{[\s\S]*\}/);
      if (m) translations = JSON.parse(m[0]);
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : String(e) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
