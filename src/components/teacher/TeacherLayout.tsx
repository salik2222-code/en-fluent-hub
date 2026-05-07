import { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ClipboardList, BarChart3, Settings, LogOut, Database } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/teacher", icon: LayoutDashboard, label: "Dashboard", end: true },
  { to: "/teacher/students", icon: Users, label: "My Students" },
  { to: "/teacher/assignments", icon: ClipboardList, label: "Assignments" },
  { to: "/teacher/analytics", icon: BarChart3, label: "AI Analytics" },
  { to: "/teacher/live-logs", icon: Database, label: "Live Logs" },
  { to: "/teacher/settings", icon: Settings, label: "Settings" },
];

export default function TeacherLayout({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex w-full text-slate-100" style={{ background: "#0a0a0b" }}>
      {/* Sidebar */}
      <aside
        className="hidden md:flex w-64 flex-col border-r border-white/5 p-5"
        style={{ background: "rgba(22,22,24,0.8)", backdropFilter: "blur(12px)" }}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            E-Speak
          </h1>
          <p className="text-xs text-slate-400 mt-1">Teacher Portal</p>
        </div>

        <nav className="flex-1 space-y-1">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                    isActive
                      ? "bg-violet-500/15 text-violet-300 border border-violet-500/20"
                      : "text-slate-400 hover:text-slate-100 hover:bg-white/5",
                  )
                }
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/5 pt-4 space-y-2">
          <div className="text-xs text-slate-500 px-3 truncate">{user?.email}</div>
          <button
            onClick={async () => {
              await signOut();
              navigate("/auth");
            }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-slate-100 hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 md:p-10 max-w-7xl mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
