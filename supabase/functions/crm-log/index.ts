// CRM bridge: appends a row to the "E Speak List" Google Sheet for every student activity.
// Columns: A=Name, B=Email, C=Activity, D=Score, E=Date
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1VqcY_evHEFpWIdDFKw6eQKBr35Dsycj-ZdB7OSEJ1IA";
const SHEET_RANGE = "Sheet1!A:E";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { display_name, email, activity_type, score, created_at } = body ?? {};

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SHEETS_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");

    if (!LOVABLE_API_KEY || !SHEETS_KEY) {
      console.warn("crm-log: missing gateway credentials");
      return new Response(JSON.stringify({ skipped: true, reason: "sheets not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const activityLabel =
      activity_type === "pronunciation" ? "Pronunciation"
      : activity_type === "grammar" ? "Grammar"
      : activity_type === "debate" ? "Debate"
      : activity_type === "tutor" ? "Tutor"
      : activity_type === "talk" ? "Talk"
      : String(activity_type ?? "");

    const dateStr = new Date(created_at ?? Date.now()).toISOString().slice(0, 10);

    const row = [
      display_name ?? "",
      email ?? "",
      activityLabel,
      score ?? "",
      dateStr,
    ];

    const url = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}:append?valueInputOption=USER_ENTERED`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SHEETS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [row] }),
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("sheets append failed", resp.status, data);
      return new Response(JSON.stringify({ ok: false, status: resp.status, error: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crm-log error", e);
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
