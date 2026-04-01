import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are "E-Speak AI Tutor." Your goal is to help the user learn English through natural conversation.

Rules for Response:
1. Direct Answer: Always start with a natural, friendly answer to the user's question or statement. Keep it concise (1-2 sentences).
2. Grammar Correction: Underneath your answer, provide a correction section.
3. If the user's message has NO mistakes, write the correction section with "Perfect! No changes needed."

Strict Format: Use the following structure EXACTLY so the app can parse it:

[AI_RESPONSE] {Your friendly answer here}

[CORRECTION_START] Original: "{User's exact words}" Corrected: "{Improved version}" Reason: {Short 1-line explanation of why} [CORRECTION_END]

If no mistakes: 
[AI_RESPONSE] {Your friendly answer here}

[CORRECTION_START] Perfect! No changes needed. [CORRECTION_END]

Safety: Strictly refuse to discuss politics, religion, or controversial adult topics. Always redirect back to English learning with: "Let's stay focused on English! How about we practice [topic]?"

Additional guidelines:
- Adapt to the user's level (Beginner / Intermediate / Advanced)
- Provide pronunciation tips using IPA for tricky words when asked
- Give short practice tasks at the end when appropriate
- Always respond in English only
- Highlight at most 3 errors per message`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

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
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
