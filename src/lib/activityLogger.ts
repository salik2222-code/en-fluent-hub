import { supabase } from "@/integrations/supabase/client";

export type ActivityType = "pronunciation" | "debate" | "grammar" | "tutor" | "talk";

export interface ActivityLog {
  activity_type: ActivityType;
  score?: number;
  duration_seconds?: number;
  details?: Record<string, unknown>;
}

/**
 * Logs a student activity to the database AND mirrors it to the CRM (Google Sheets).
 * Safe to call anonymously — it just no-ops if user not signed in.
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

  // Fire-and-forget CRM mirror
  supabase.functions
    .invoke("crm-log", {
      body: {
        user_id: user.id,
        email: user.email,
        ...payload,
        created_at: new Date().toISOString(),
      },
    })
    .catch((e) => console.warn("crm mirror failed", e));
}
