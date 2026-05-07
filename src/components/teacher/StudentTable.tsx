import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface StudentRow {
  user_id: string;
  display_name: string;
  level: string;
  last_active: string | null;
  progress_pct: number;
  activities: { pronunciation: number; debate: number; grammar: number; tutor: number; talk: number };
}

function CircularProgress({ value }: { value: number }) {
  const r = 18;
  const c = 2 * Math.PI * r;
  const off = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative h-12 w-12">
      <svg className="h-12 w-12 -rotate-90" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
        <circle
          cx="22"
          cy="22"
          r={r}
          stroke="url(#g)"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.6s" }}
        />
        <defs>
          <linearGradient id="g" x1="0" x2="1">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-slate-100">{value}%</span>
    </div>
  );
}

function timeAgo(iso: string | null) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function StudentTable({ rows, onView }: { rows: StudentRow[]; onView?: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const filtered = useMemo(() => {
    const f = rows.filter((r) => r.display_name?.toLowerCase().includes(q.toLowerCase()));
    return [...f].sort((a, b) => {
      const av = a.last_active ? new Date(a.last_active).getTime() : 0;
      const bv = b.last_active ? new Date(b.last_active).getTime() : 0;
      return sortDesc ? bv - av : av - bv;
    });
  }, [rows, q, sortDesc]);

  return (
    <div
      className="rounded-2xl border border-white/5 overflow-hidden"
      style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
    >
      <div className="p-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between border-b border-white/5">
        <h3 className="text-lg font-semibold text-slate-100">Students</h3>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="pl-9 bg-white/5 border-white/10 text-slate-100 placeholder:text-slate-500"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortDesc((s) => !s)}
            className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10"
          >
            <ArrowUpDown className="h-4 w-4 mr-1" /> Last Active
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase tracking-wider text-slate-400 bg-white/[0.02]">
            <tr>
              <th className="text-left px-4 py-3">Student</th>
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-left px-4 py-3">Last Active</th>
              <th className="text-left px-4 py-3">Activities</th>
              <th className="text-left px-4 py-3">Progress</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-slate-500">
                  No students yet.
                </td>
              </tr>
            )}
            {filtered.map((r, i) => (
              <motion.tr
                key={r.user_id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="border-t border-white/5 hover:bg-white/[0.03]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full grid place-items-center bg-violet-500/15 border border-violet-500/20 text-violet-200 font-semibold">
                      {r.display_name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div className="text-slate-100 font-medium">{r.display_name || "Unnamed"}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-300 capitalize">{r.level}</td>
                <td className="px-4 py-3 text-slate-400">{timeAgo(r.last_active)}</td>
                <td className="px-4 py-3 text-slate-400">
                  {r.activities.debate}D · {r.activities.pronunciation}P · {r.activities.grammar}G
                </td>
                <td className="px-4 py-3">
                  <CircularProgress value={r.progress_pct} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    onClick={() => onView?.(r.user_id)}
                    className="bg-violet-500/20 text-violet-200 border border-violet-500/30 hover:bg-violet-500/30"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> View Logs
                  </Button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
