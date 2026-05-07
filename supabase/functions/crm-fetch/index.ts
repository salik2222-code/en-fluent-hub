// Returns recent rows from the "E Speak List" Google Sheet for the Teacher Portal.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";
const SHEET_ID = "1VqcY_evHEFpWIdDFKw6eQKBr35Dsycj-ZdB7OSEJ1IA";
const SHEET_RANGE = "Sheet1!A:E";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const SHEETS_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");

  if (!LOVABLE_API_KEY || !SHEETS_KEY) {
    return new Response(JSON.stringify({ rows: [], configured: false }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const url = `${GATEWAY_URL}/spreadsheets/${SHEET_ID}/values/${SHEET_RANGE}`;
    const resp = await fetch(url, {
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": SHEETS_KEY,
      },
    });

    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      console.error("sheets read failed", resp.status, data);
      return new Response(JSON.stringify({ rows: [], error: data, status: resp.status }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const values: string[][] = Array.isArray(data?.values) ? data.values : [];
    // Detect header row (Name in column A)
    const hasHeader = values[0]?.[0]?.toLowerCase?.() === "name" ||
                      values[0]?.[0]?.toLowerCase?.()?.includes("student");
    const dataRows = hasHeader ? values.slice(1) : values;

    const rows = dataRows.map((r) => ({
      name: r[0] ?? "",
      email: r[1] ?? "",
      activity: r[2] ?? "",
      score: r[3] ?? "",
      date: r[4] ?? "",
    })).reverse(); // newest first

    return new Response(JSON.stringify({ rows, configured: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("crm-fetch error", e);
    return new Response(JSON.stringify({ rows: [], error: String(e) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
