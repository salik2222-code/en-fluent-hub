import { useEffect, useState } from "react";
import TeacherLayout from "@/components/teacher/TeacherLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TeacherAssignments() {
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("daily_goal");
  const [target, setTarget] = useState(30);

  const load = async () => {
    const { data } = await supabase.from("assignments").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
  };
  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("assignments").insert([{
      title, description: desc, assignment_type: type, target_minutes: target, created_by: user.id,
    } as any]);
    if (error) return toast.error(error.message);
    toast.success("Assignment created");
    setTitle(""); setDesc(""); setTarget(30);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("assignments").delete().eq("id", id);
    load();
  };

  return (
    <TeacherLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-50">Assignments</h1>
        <p className="text-slate-400 mt-1">Push daily goals and debate topics to your students</p>
      </header>

      <motion.form
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        onSubmit={create}
        className="rounded-2xl border border-white/5 p-6 mb-8 space-y-4"
        style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}
      >
        <h3 className="text-lg font-semibold text-slate-100">New Assignment</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-slate-300">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={120}
              className="bg-white/5 border-white/10 text-slate-100" />
          </div>
          <div>
            <Label className="text-slate-300">Type</Label>
            <select value={type} onChange={(e) => setType(e.target.value)}
              className="w-full h-10 rounded-md bg-white/5 border border-white/10 text-slate-100 px-3">
              <option value="daily_goal">Daily Goal</option>
              <option value="debate_topic">Debate Topic</option>
              <option value="pronunciation">Pronunciation Drill</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-slate-300">Description</Label>
            <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={500}
              className="bg-white/5 border-white/10 text-slate-100" />
          </div>
          <div>
            <Label className="text-slate-300">Target Minutes</Label>
            <Input type="number" min={1} max={240} value={target}
              onChange={(e) => setTarget(parseInt(e.target.value) || 30)}
              className="bg-white/5 border-white/10 text-slate-100" />
          </div>
        </div>
        <Button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90">
          <Plus className="h-4 w-4 mr-1" /> Create
        </Button>
      </motion.form>

      <div className="space-y-3">
        {list.length === 0 && <p className="text-slate-500 text-sm">No assignments yet.</p>}
        {list.map((a, i) => (
          <motion.div key={a.id}
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-white/5 p-4 flex items-center justify-between"
            style={{ background: "rgba(22,22,24,0.7)", backdropFilter: "blur(12px)" }}>
            <div>
              <div className="text-slate-100 font-medium">{a.title}</div>
              <div className="text-xs text-slate-400 mt-1">{a.assignment_type} · {a.target_minutes}m</div>
              {a.description && <div className="text-sm text-slate-400 mt-2">{a.description}</div>}
            </div>
            <Button variant="ghost" size="icon" onClick={() => remove(a.id)} className="text-slate-400 hover:text-red-400">
              <Trash2 className="h-4 w-4" />
            </Button>
          </motion.div>
        ))}
      </div>
    </TeacherLayout>
  );
}
