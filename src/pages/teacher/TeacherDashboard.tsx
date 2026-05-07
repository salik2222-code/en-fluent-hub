import { useEffect, useState } from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import StatsCard from "@/components/teacher/StatsCard";
import StudentTable, { StudentRow } from "@/components/teacher/StudentTable";
import { Users, Mic, MessageSquare, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Activity {
  user_id: string;
  activity_type: string;
  score: number | null;
  duration_seconds: number | null;
  created_at: string;
}

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    avgPron: 0,
    debateMin: 0,
    grammarAcc: 0,
  });
  const [trend, setTrend] = useState<{ day: string; value: number }[]>([]);

  useEffect(() => {
    (async () => {
      // Fetch student profiles via the student role
      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "student");

      const studentIds = (roles ?? []).map((r) => r.user_id);

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, level")
        .in("user_id", studentIds.length ? studentIds : ["00000000-0000-0000-0000-000000000000"]);

      const { data: acts } = await supabase
        .from("student_activities")
        .select("user_id, activity_type, score, duration_seconds, created_at")
        .order("created_at", { ascending: false })
        .limit(1000);

      const activities = (acts ?? []) as Activity[];

      // Build per-student aggregates
      const rows: StudentRow[] = (profiles ?? []).map((p) => {
        const mine = activities.filter((a) => a.user_id === p.user_id);
        const counts = { pronunciation: 0, debate: 0, grammar: 0, tutor: 0, talk: 0 };
        mine.forEach((a) => {
          if (a.activity_type in counts) (counts as any)[a.activity_type]++;
        });
        const totalActs = mine.length;
        const progress = Math.min(100, totalActs * 5);
        return {
          user_id: p.user_id,
          display_name: p.display_name ?? "Unnamed",
          level: p.level ?? "Beginner",
          last_active: mine[0]?.created_at ?? null,
          progress_pct: progress,
          activities: counts,
        };
      });
      setStudents(rows);

      // Stats
      const pron = activities.filter((a) => a.activity_type === "pronunciation" && a.score != null);
      const avgPron = pron.length ? Math.round(pron.reduce((s, a) => s + (a.score ?? 0), 0) / pron.length) : 0;
      const debateMin = Math.round(
        activities.filter((a) => a.activity_type === "debate").reduce((s, a) => s + (a.duration_seconds ?? 0), 0) / 60,
      );
      const gr = activities.filter((a) => a.activity_type === "grammar" && a.score != null);
      const grammarAcc = gr.length ? Math.round(gr.reduce((s, a) => s + (a.score ?? 0), 0) / gr.length) : 0;

      setStats({ total: rows.length, avgPron, debateMin, grammarAcc });

      // Last 7 days trend
      const days: { day: string; value: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        const count = activities.filter((a) => a.created_at.slice(0, 10) === key).length;
        days.push({ day: d.toLocaleDateString("en", { weekday: "short" }), value: count });
      }
      setTrend(days);
    })();
  }, []);

  return (
    <TeacherLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Dashboard</h1>
        <p className="text-slate-400 mt-1">Real-time class performance overview</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard label="Total Students" value={stats.total} icon={Users} delay={0} />
        <StatsCard label="Avg. Pronunciation" value={`${stats.avgPron}%`} icon={Mic} delay={0.05} />
        <StatsCard label="Debate Minutes" value={stats.debateMin} icon={MessageSquare} delay={0.1} />
        <StatsCard label="Grammar Accuracy" value={`${stats.grammarAcc}%`} icon={FileText} delay={0.15} />
      </section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border border-white/5 p-5 mb-8"
        style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
      >
        <h3 className="text-lg font-semibold text-slate-100 mb-4">Weekly Class Activity</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trend}>
              <defs>
                <linearGradient id="lg" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              <Line type="monotone" dataKey="value" stroke="url(#lg)" strokeWidth={3} dot={{ fill: "#a855f7", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      <StudentTable rows={students} onView={(id) => navigate(`/teacher/students?id=${id}`)} />
    </TeacherLayout>
  );
}
