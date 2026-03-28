import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, topic, mode } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    let systemPrompt = "";
    
    if (mode === "debate") {
      systemPrompt = `You are an AI debate partner in E-Speak, an English learning app. The topic is: "${topic}".

Rules:
- Take the OPPOSITE position from the user to create a healthy debate
- Keep responses to 2-3 sentences max
- Use vocabulary appropriate for English learners
- After every 2 exchanges, briefly note 1 grammar or vocabulary improvement the user could make
- Stay strictly on-topic. If user goes off-topic, redirect politely
- Never discuss politics, religion, explicit content, or controversial issues
- Be respectful but challenging — push the user to express themselves better
- After 4 rounds, wrap up with a brief summary of the user's English performance`;
    } else {
      systemPrompt = `You are an AI discussion partner in E-Speak, an English learning app. The topic is: "${topic}".

Rules:
- Have a natural conversation about the topic
- Ask follow-up questions to encourage the user to speak more
- Keep responses to 2-3 sentences, then ask a question
- After every 2 exchanges, gently correct 1 grammar or vocabulary mistake
- Stay strictly on-topic. If user goes off-topic, redirect politely
- Never discuss politics, religion, explicit content, or controversial issues
- Be warm, encouraging, and supportive`;
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
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI service error");
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Discussion error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
