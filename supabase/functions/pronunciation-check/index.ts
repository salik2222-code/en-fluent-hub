import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are a pronunciation coach. Compare the expected sentence with what the user actually said (from speech recognition). Return a JSON response:
{
  "score": 85,
  "feedback": [
    { "type": "correct", "text": "Good stress on 'beautiful'" },
    { "type": "correct", "text": "Clear consonant sounds" },
    { "type": "improvement", "text": "Work on the 'th' sound in 'the' — place tongue between teeth" }
  ],
  "ipa_tips": [
    { "word": "beautiful", "ipa": "/ˈbjuː.tɪ.fəl/", "tip": "Stress the first syllable: BYOO-tih-ful" }
  ],
  "overall": "Great attempt! Focus on the 'th' sound for improvement."
}
Rules:
- Score 0-100 based on how closely the spoken text matches expected
- Give 2-4 feedback items (mix of correct and improvement)
- Give 1-2 IPA tips for tricky words
- If spoken text is very different from expected, give lower score and more tips
- Be encouraging but honest
- Return valid JSON only`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expected, spoken } = await req.json();
    if (!expected || !spoken) {
      return new Response(JSON.stringify({ error: "Both expected and spoken text are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Expected: "${expected}"\nSpoken: "${spoken}"` },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("AI service error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";
    
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { score: 70, feedback: [{ type: "improvement", text: "Try again for better analysis" }], ipa_tips: [], overall: content };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Pronunciation check error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
