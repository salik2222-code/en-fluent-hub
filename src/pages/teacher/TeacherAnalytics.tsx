import { useEffect, useState } from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#a855f7", "#ec4899", "#8b5cf6", "#f472b6", "#c084fc"];

export default function TeacherAnalytics() {
  const [byType, setByType] = useState<{ name: string; count: number }[]>([]);
  const [perStudent, setPerStudent] = useState<{ name: string; minutes: number }[]>([]);

  useEffect(() => {
    (async () => {
      const { data: acts } = await supabase
        .from("student_activities")
        .select("user_id, activity_type, duration_seconds")
        .limit(2000);

      const counts: Record<string, number> = {};
      (acts ?? []).forEach((a: any) => {
        counts[a.activity_type] = (counts[a.activity_type] ?? 0) + 1;
      });
      setByType(Object.entries(counts).map(([name, count]) => ({ name, count })));

      const dur: Record<string, number> = {};
      (acts ?? []).forEach((a: any) => {
        dur[a.user_id] = (dur[a.user_id] ?? 0) + (a.duration_seconds ?? 0);
      });
      const ids = Object.keys(dur);
      const { data: profs } = await supabase
        .from("profiles")
        .select("user_id, display_name")
        .in("user_id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);
      setPerStudent(
        (profs ?? []).map((p: any) => ({
          name: p.display_name ?? "—",
          minutes: Math.round((dur[p.user_id] ?? 0) / 60),
        })).sort((a, b) => b.minutes - a.minutes).slice(0, 10),
      );
    })();
  }, []);

  return (
    <TeacherLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">AI Analytics</h1>
        <p className="text-slate-400 mt-1">Deep insights into class performance</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Activity Mix</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byType} dataKey="count" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {byType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Legend wrapperStyle={{ color: "#cbd5e1" }} />
                <Tooltip contentStyle={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/5 p-5"
          style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}>
          <h3 className="text-lg font-semibold text-slate-100 mb-4">Top Learners (minutes)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perStudent}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ background: "#161618", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12 }} />
                <Bar dataKey="minutes" fill="#a855f7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </TeacherLayout>
  );
}
