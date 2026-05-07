import { useEffect, useState } from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import StudentTable, { StudentRow } from "@/components/teacher/StudentTable";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function TeacherStudents() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("user_id").eq("role", "student");
      const ids = (roles ?? []).map((r) => r.user_id);
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, level")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      const { data: acts } = await supabase
        .from("student_activities")
        .select("user_id, activity_type, score, duration_seconds, created_at")
        .order("created_at", { ascending: false })
        .limit(2000);

      const rows: StudentRow[] = (profiles ?? []).map((p) => {
        const mine = (acts ?? []).filter((a: any) => a.user_id === p.user_id);
        const counts = { pronunciation: 0, debate: 0, grammar: 0, tutor: 0, talk: 0 };
        mine.forEach((a: any) => { if (a.activity_type in counts) (counts as any)[a.activity_type]++; });
        return {
          user_id: p.user_id,
          display_name: p.display_name ?? "Unnamed",
          level: p.level ?? "Beginner",
          last_active: mine[0]?.created_at ?? null,
          progress_pct: Math.min(100, mine.length * 5),
          activities: counts,
        };
      });
      setStudents(rows);
    })();
  }, []);

  const openLogs = async (id: string) => {
    setOpenId(id);
    const { data } = await supabase
      .from("student_activities")
      .select("*")
      .eq("user_id", id)
      .order("created_at", { ascending: false })
      .limit(50);
    setLogs(data ?? []);
  };

  return (
    <TeacherLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">My Students</h1>
        <p className="text-slate-400 mt-1">Track everyone's progress in real time</p>
      </header>
      <StudentTable rows={students} onView={openLogs} />

      <Dialog open={!!openId} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="bg-[#161618] border-white/10 text-slate-100 max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Activity Logs</DialogTitle>
          </DialogHeader>
          {logs.length === 0 && <p className="text-slate-400 text-sm">No activity yet.</p>}
          <div className="space-y-2">
            {logs.map((l) => (
              <div key={l.id} className="rounded-lg border border-white/5 p-3 bg-white/5">
                <div className="flex justify-between text-sm">
                  <span className="capitalize text-violet-300 font-medium">{l.activity_type}</span>
                  <span className="text-slate-500 text-xs">{new Date(l.created_at).toLocaleString()}</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {l.score != null && <>Score: {l.score} · </>}
                  Duration: {l.duration_seconds ?? 0}s
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </TeacherLayout>
  );
}
