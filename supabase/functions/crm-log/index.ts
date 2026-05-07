// CRM bridge: mirrors student activity rows to Google Sheets via the Lovable connector gateway.
// Non-fatal: if Sheets is misconfigured, returns 200 with `skipped: true` so client logging is unaffected.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

// Configure these via env (or hardcode for the project)
const SHEET_ID = Deno.env.get("CRM_SHEET_ID") ?? "";
const SHEET_RANGE = Deno.env.get("CRM_SHEET_RANGE") ?? "Activities!A:G";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    const { user_id, email, activity_type, score, duration_seconds, details, created_at } = body ?? {};

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SHEETS_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");

    if (!SHEET_ID || !LOVABLE_API_KEY || !SHEETS_KEY) {
      return new Response(JSON.stringify({ skipped: true, reason: "sheets not configured" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const row = [
      created_at ?? new Date().toISOString(),
      user_id ?? "",
      email ?? "",
      activity_type ?? "",
      score ?? "",
      duration_seconds ?? 0,
      JSON.stringify(details ?? {}),
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
