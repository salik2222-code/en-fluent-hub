import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  displayName: z.string().trim().min(1).max(80).optional(),
});

interface Props {
  role: "student" | "teacher";
}

export default function AuthPortal({ role }: Props) {
  const navigate = useNavigate();
  const { user, role: currentRole, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const isTeacher = role === "teacher";
  const accent = isTeacher ? "from-cyan-500 to-blue-600" : "from-violet-600 to-fuchsia-600";
  const Icon = isTeacher ? ShieldCheck : GraduationCap;
  const title = isTeacher ? "Teacher Portal" : "Student Login";
  const subtitle = isTeacher ? "Secure access for educators" : "Continue your English journey";

  useEffect(() => {
    if (!loading && user) {
      navigate(currentRole === "teacher" ? "/teacher" : "/dashboard", { replace: true });
    }
  }, [user, currentRole, loading, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password, displayName });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { display_name: displayName, role },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to verify.");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen grid place-items-center p-4 text-slate-100 relative overflow-hidden" style={{ background: "#0a0a0b" }}>
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-30" style={{ background: `radial-gradient(circle, ${isTeacher ? "#06b6d4" : "#a855f7"} 0%, transparent 70%)` }} />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-25" style={{ background: `radial-gradient(circle, ${isTeacher ? "#3b82f6" : "#ec4899"} 0%, transparent 70%)` }} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 p-8"
        style={{ background: "rgba(22,22,24,0.75)", backdropFilter: "blur(16px)" }}
      >
        <button onClick={() => navigate("/")} className="text-xs text-slate-400 hover:text-slate-200 mb-6">← Back to home</button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`h-11 w-11 rounded-2xl bg-gradient-to-br ${accent} grid place-items-center shadow-lg`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">{title}</h1>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-white/5 border border-white/10">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input className="mt-1.5 bg-white/5 border-white/10 text-slate-100" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label className="text-slate-300">Password</Label>
                <Input className="mt-1.5 bg-white/5 border-white/10 text-slate-100" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={busy} className={`w-full h-11 rounded-xl bg-gradient-to-r ${accent} hover:opacity-90`}>
                {busy ? "..." : "Login"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label className="text-slate-300">{isTeacher ? "Full Name" : "Display Name"}</Label>
                <Input className="mt-1.5 bg-white/5 border-white/10 text-slate-100" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input className="mt-1.5 bg-white/5 border-white/10 text-slate-100" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label className="text-slate-300">Password</Label>
                <Input className="mt-1.5 bg-white/5 border-white/10 text-slate-100" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" disabled={busy} className={`w-full h-11 rounded-xl bg-gradient-to-r ${accent} hover:opacity-90`}>
                {busy ? "..." : `Create ${isTeacher ? "Teacher" : "Student"} Account`}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center text-xs text-slate-500 mt-6">
          {isTeacher ? (
            <>Are you a student? <button onClick={() => navigate("/login")} className="text-violet-300 hover:underline">Student login</button></>
          ) : (
            <>Are you a teacher? <button onClick={() => navigate("/teacher-login")} className="text-cyan-300 hover:underline">Teacher login</button></>
          )}
        </p>
      </motion.div>
    </div>
  );
}
