import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, ShieldCheck, Mic, MessageSquare, FileText, Users, Trophy, Sparkles } from "lucide-react";
import robotMascot from "@/assets/robot-mascot.png";

const features = [
  { icon: MessageSquare, title: "AI Tutor", desc: "24/7 conversational coach for vocabulary and real talk." },
  { icon: Mic, title: "Pronunciation", desc: "Phoneme-level scoring with instant voice feedback." },
  { icon: FileText, title: "Grammar", desc: "Write or speak — get clear corrections and tips." },
  { icon: Users, title: "Discussion & Debate", desc: "Safe, curated topics with an AI partner." },
  { icon: Trophy, title: "Roadmap & XP", desc: "Track streaks, badges and daily 30-min goals." },
  { icon: Sparkles, title: "Talk with E-Speak", desc: "Voice-first chat in a kid-safe environment." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen text-slate-100 relative overflow-x-hidden" style={{ background: "#0a0a0b" }}>
      {/* ambient glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-30" style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }} />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-25" style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 70%)" }} />

      {/* Nav */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="text-lg font-bold tracking-tight">E-Speak</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            Student Login
          </button>
          <button
            onClick={() => navigate("/teacher-login")}
            className="px-4 py-2 rounded-xl text-sm border border-violet-500/30 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20 transition"
          >
            Teacher Login
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-6 md:px-12 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
              <Sparkles className="h-3 w-3" /> AI-powered English coaching
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] tracking-tight">
              Speak English{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                with confidence
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl">
              From your first "hello" to fluent debate — E-Speak is a focused, safe, and beautifully designed
              English-only learning app for students, with a powerful portal for teachers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                onClick={() => navigate("/login")}
                className="h-12 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
              >
                <GraduationCap className="h-4 w-4 mr-2" /> I'm a Student
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/teacher-login")}
                className="h-12 px-6 rounded-xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
              >
                <ShieldCheck className="h-4 w-4 mr-2" /> I'm a Teacher
              </Button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative">
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-violet-500/30 to-fuchsia-500/20 blur-3xl" />
            <div className="relative rounded-[2rem] border border-white/10 p-6" style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(16px)" }}>
              <img src={robotMascot} alt="E-Speak mascot" className="w-full max-w-md mx-auto drop-shadow-2xl animate-[float_3s_ease-in-out_infinite]" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to master English</h2>
            <p className="text-slate-400 mt-3">Crafted with care, built for focus.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="rounded-2xl border border-white/5 p-6 hover:border-violet-500/30 transition group"
                style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
              >
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 group-hover:from-violet-500/30 group-hover:to-fuchsia-500/30 transition">
                  <f.icon className="h-5 w-5 text-violet-300" />
                </div>
                <h3 className="font-semibold text-slate-100">{f.title}</h3>
                <p className="text-sm text-slate-400 mt-2">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 md:px-12 pb-24">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 p-10 md:p-14 text-center relative overflow-hidden" style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(16px)" }}>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to start?</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Join learners and teachers using E-Speak every day.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
              <Button onClick={() => navigate("/login")} className="h-12 px-6 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500">
                Student Login
              </Button>
              <Button onClick={() => navigate("/teacher-login")} variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">
                Teacher Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} E-Speak — Speak English, beautifully.
      </footer>
    </div>
  );
};

export default Landing;
