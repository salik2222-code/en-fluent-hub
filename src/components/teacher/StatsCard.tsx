import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  delay?: number;
}

export default function StatsCard({ label, value, hint, icon: Icon, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative overflow-hidden rounded-2xl border border-white/5 p-5"
      style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
    >
      <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-violet-500/10 blur-2xl" />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
          <p className="text-3xl font-bold text-slate-50 mt-2">{value}</p>
          {hint && <p className="text-xs text-slate-500 mt-1">{hint}</p>}
        </div>
        <div className="h-10 w-10 rounded-xl grid place-items-center bg-violet-500/15 border border-violet-500/20">
          <Icon className="h-5 w-5 text-violet-300" />
        </div>
      </div>
    </motion.div>
  );
}
