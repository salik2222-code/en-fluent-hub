import { useEffect, useMemo, useState } from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RefreshCw, Search, ExternalLink, Database } from "lucide-react";
import { motion } from "framer-motion";
import { GOOGLE_SHEET_CRM_URL } from "@/lib/crm-bridge";

interface SheetRow {
  name: string;
  email: string;
  activity: string;
  score: string;
  date: string;
}

export default function TeacherLiveLogs() {
  const [rows, setRows] = useState<SheetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState(true);
  const [q, setQ] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("crm-fetch", { body: {} });
    if (!error && data) {
      setRows((data as any).rows ?? []);
      setConfigured((data as any).configured !== false);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.activity, r.score, r.date].some((v) => v.toLowerCase().includes(s)),
    );
  }, [rows, q]);

  return (
    <TeacherLayout>
      <header className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-50 flex items-center gap-2">
            <Database className="h-7 w-7 text-violet-400" /> Live Logs
          </h1>
          <p className="text-slate-400 mt-1">Real-time CRM stream from the connected Google Sheet</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={GOOGLE_SHEET_CRM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-100 px-3 py-2 rounded-xl border border-white/10 bg-white/5"
          >
            Open Sheet <ExternalLink className="h-3 w-3" />
          </a>
          <Button onClick={load} disabled={loading} className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:opacity-90">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </header>

      {!configured && (
        <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          Google Sheets connector not yet configured. Connect "E Speak List" to enable live logs.
        </div>
      )}

      <div className="mb-4 relative max-w-md">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Search name, email, activity..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="pl-9 bg-white/5 border-white/10 text-slate-100"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-white/5 overflow-hidden"
        style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-slate-400 uppercase border-b border-white/5 bg-white/[0.02]">
              <tr>
                <th className="text-left px-5 py-3">Student</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Activity</th>
                <th className="text-left px-5 py-3">Score</th>
                <th className="text-left px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">Loading live logs...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No activity yet. Logs appear here as students complete activities.</td></tr>
              )}
              {filtered.map((r, i) => (
                <tr key={i} className="border-t border-white/5 hover:bg-white/[0.03] transition">
                  <td className="px-5 py-3 text-slate-100 font-medium">{r.name || "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{r.email || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-0.5 rounded-md text-xs bg-violet-500/15 text-violet-300 border border-violet-500/20">
                      {r.activity || "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-200">{r.score || "—"}</td>
                  <td className="px-5 py-3 text-slate-400">{r.date || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </TeacherLayout>
  );
}
