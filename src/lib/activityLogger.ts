import { supabase } from "@/integrations/supabase/client";

export type ActivityType = "pronunciation" | "debate" | "grammar" | "tutor" | "talk";

export interface ActivityLog {
  activity_type: ActivityType;
  score?: number;
  duration_seconds?: number;
  details?: Record<string, unknown>;
}

/**
 * Logs a student activity to the database AND mirrors it to the
 * "E Speak List" Google Sheet (one row per activity).
 */
export async function logActivity(activity: ActivityLog) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const payload = {
    user_id: user.id,
    activity_type: activity.activity_type,
    score: activity.score ?? null,
    duration_seconds: activity.duration_seconds ?? 0,
    details: activity.details ?? {},
  };

  const { error } = await supabase.from("student_activities").insert([payload as any]);
  if (error) console.error("activity log error", error);

  // Look up display name for the sheet
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  // Fire-and-forget CRM mirror — appends to the Google Sheet
  supabase.functions
    .invoke("crm-log", {
      body: {
        display_name: profile?.display_name ?? user.email?.split("@")[0] ?? "",
        email: user.email,
        activity_type: activity.activity_type,
        score: activity.score ?? null,
        created_at: new Date().toISOString(),
      },
    })
    .catch((e) => console.warn("crm mirror failed", e));
}
