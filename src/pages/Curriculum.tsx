import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Coffee, Hash, CalendarDays, Users, ShoppingCart, Clock, Briefcase, Heart, Plane, MessageCircle, Trophy, Monitor, Globe, Quote, GraduationCap, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Lesson = { id: string; title: string; done: boolean };
type Topic = { title: string; icon: React.ElementType; lessons: Lesson[] };
type CurriculumData = { beginner: Topic[]; intermediate: Topic[]; advanced: Topic[] };

const makeLessons = (titles: string[], topicIdx: number, level: string): Lesson[] =>
  titles.map((t, i) => ({ id: `${level}-${topicIdx}-${i}`, title: t, done: false }));

const defaultCurriculum: CurriculumData = {
  beginner: [
    { title: "Greetings & Introductions", icon: Coffee, lessons: makeLessons(["Saying Hello & Goodbye", "Introducing Yourself", "Asking About Others", "Formal vs Informal", "Practice Conversation"], 0, "b") },
    { title: "Numbers, Time & Dates", icon: Hash, lessons: makeLessons(["Counting 1-100", "Telling the Time", "Days & Months", "Ordinal Numbers"], 1, "b") },
    { title: "Daily Routines", icon: CalendarDays, lessons: makeLessons(["Morning Routine", "At School/Work", "Afternoon Activities", "Evening & Night", "Simple Present Tense", "Describing Your Day"], 2, "b") },
    { title: "Family & Home", icon: Users, lessons: makeLessons(["Family Members", "Describing People", "Rooms in the House", "Household Items", "My Family Story"], 3, "b") },
    { title: "Food & Shopping", icon: ShoppingCart, lessons: makeLessons(["Common Foods", "At a Restaurant", "Asking for Prices", "Grocery Shopping", "Ordering Takeaway", "Food Preferences"], 4, "b") },
  ],
  intermediate: [
    { title: "Past Experiences", icon: Clock, lessons: makeLessons(["Simple Past Tense", "Irregular Verbs", "Telling a Story", "Past Continuous", "Used to + Infinitive", "Comparing Past & Present", "Writing a Memoir"], 0, "i") },
    { title: "Work & Career", icon: Briefcase, lessons: makeLessons(["Office Vocabulary", "Job Interviews", "Writing Emails", "Meetings & Calls", "Career Goals", "Giving Feedback"], 1, "i") },
    { title: "Health & Fitness", icon: Heart, lessons: makeLessons(["Body Parts", "At the Doctor", "Describing Symptoms", "Sports & Exercise", "Healthy Habits"], 2, "i") },
    { title: "Travel & Culture", icon: Plane, lessons: makeLessons(["At the Airport", "Booking Hotels", "Asking Directions", "Local Customs", "Travel Stories", "Currency & Money", "Restaurant Abroad", "Emergency Phrases"], 3, "i") },
    { title: "Expressing Opinions", icon: MessageCircle, lessons: makeLessons(["I think / I believe", "Agreeing & Disagreeing", "Giving Reasons", "Comparing Options", "Formal Opinions", "Debate Basics", "Summary & Conclusion"], 4, "i") },
  ],
  advanced: [
    { title: "Business Negotiations", icon: Trophy, lessons: makeLessons(["Opening a Negotiation", "Making Proposals", "Counter-Offers", "Handling Objections", "Reaching Agreement", "Formal Language", "Power Phrases", "Body Language", "Case Study 1", "Case Study 2"], 0, "a") },
    { title: "Public Speaking", icon: Monitor, lessons: makeLessons(["Structuring a Speech", "Opening Lines", "Using Visual Aids", "Engaging the Audience", "Handling Q&A", "Persuasive Techniques", "Practice Speech 1", "Practice Speech 2"], 1, "a") },
    { title: "Social Issues & Debates", icon: Globe, lessons: makeLessons(["Building Arguments", "Using Evidence", "Counter-Arguments", "Transition Words", "Formal Debate Format", "Topic: Technology", "Topic: Environment", "Topic: Education", "Practice Debate"], 2, "a") },
    { title: "Idioms & Slang", icon: Quote, lessons: makeLessons(["Common Idioms A-G", "Common Idioms H-N", "Common Idioms O-Z", "Slang in Conversation", "Idioms in Business", "Regional Expressions", "Practice: Use Them!"], 3, "a") },
    { title: "Academic Writing & Ethics", icon: GraduationCap, lessons: makeLessons(["Essay Structure", "Thesis Statements", "Evidence & Citations", "Formal Tone", "Paragraph Transitions", "Paraphrasing", "Avoiding Plagiarism", "Argumentative Essay", "Research Paper Intro", "Final Review"], 4, "a") },
  ],
};

const STORAGE_KEY = "espeak-curriculum";

function loadProgress(): CurriculumData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(defaultCurriculum));
    const saved = JSON.parse(raw) as Record<string, boolean>;
    const data = JSON.parse(JSON.stringify(defaultCurriculum)) as CurriculumData;
    for (const level of ["beginner", "intermediate", "advanced"] as const) {
      for (const topic of data[level]) {
        for (const lesson of topic.lessons) {
          if (saved[lesson.id]) lesson.done = true;
        }
      }
    }
    return data;
  } catch { return JSON.parse(JSON.stringify(defaultCurriculum)); }
}

function saveProgress(data: CurriculumData) {
  const map: Record<string, boolean> = {};
  for (const level of ["beginner", "intermediate", "advanced"] as const)
    for (const topic of data[level])
      for (const lesson of topic.lessons)
        if (lesson.done) map[lesson.id] = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function getLevelPercent(topics: Topic[]): number {
  let done = 0, total = 0;
  for (const t of topics) for (const l of t.lessons) { total++; if (l.done) done++; }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

const Curriculum = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CurriculumData>(loadProgress);
  useEffect(() => { saveProgress(data); }, [data]);

  const beginnerPct = getLevelPercent(data.beginner);
  const intUnlocked = beginnerPct >= 80;
  const intPct = getLevelPercent(data.intermediate);
  const advUnlocked = intUnlocked && intPct >= 80;

  const toggleLesson = useCallback((level: string, topicIdx: number, lessonIdx: number) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CurriculumData;
      const lvl = level as keyof CurriculumData;
      next[lvl][topicIdx].lessons[lessonIdx].done = !next[lvl][topicIdx].lessons[lessonIdx].done;
      return next;
    });
  }, []);

  const renderRoadmap = (topics: Topic[], level: string, locked: boolean) => {
    if (locked) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          <Lock className="h-10 w-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium text-lg">Complete 80% of the previous level to unlock</p>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />
        <div className="space-y-6">
          {topics.map((topic, tIdx) => {
            const completed = topic.lessons.filter((l) => l.done).length;
            const total = topic.lessons.length;
            const pct = Math.round((completed / total) * 100);
            const isDone = completed === total;
            const Icon = topic.icon;

            return (
              <div key={tIdx} className="relative pl-14">
                {/* Timeline node */}
                <div className={`absolute left-4 top-4 w-5 h-5 rounded-full border-2 z-10 ${isDone ? "bg-primary border-primary" : "bg-background border-primary"}`}>
                  {isDone && <CheckCircle2 className="h-3 w-3 text-primary-foreground absolute top-0.5 left-0.5" />}
                </div>

                <Card className={`transition-all ${isDone ? "border-primary/30 bg-primary/5" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDone ? "bg-primary/20" : "bg-secondary"}`}>
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground">{completed}/{total} lessons • {pct}%</p>
                      </div>
                      {isDone && <Badge className="bg-primary text-primary-foreground">Complete</Badge>}
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-secondary rounded-full h-2 mb-4">
                      <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>

                    {/* Lesson checklist */}
                    <div className="space-y-2">
                      {topic.lessons.map((lesson, lIdx) => (
                        <label
                          key={lesson.id}
                          className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all hover:bg-secondary/50 ${lesson.done ? "bg-primary/5" : ""}`}
                        >
                          <Checkbox
                            checked={lesson.done}
                            onCheckedChange={() => toggleLesson(level, tIdx, lIdx)}
                          />
                          <span className={`text-sm flex-1 ${lesson.done ? "line-through text-muted-foreground" : ""}`}>
                            {lesson.title}
                          </span>
                          {lesson.done && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5 mr-2" />Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learning Roadmap
          </h1>
          <p className="text-muted-foreground text-lg">Step-by-step path from beginner to advanced</p>
        </div>

        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="beginner">Beginner ({beginnerPct}%)</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate {!intUnlocked && "🔒"}</TabsTrigger>
            <TabsTrigger value="advanced">Advanced {!advUnlocked && "🔒"}</TabsTrigger>
          </TabsList>

          <TabsContent value="beginner">{renderRoadmap(data.beginner, "beginner", false)}</TabsContent>
          <TabsContent value="intermediate">{renderRoadmap(data.intermediate, "intermediate", !intUnlocked)}</TabsContent>
          <TabsContent value="advanced">{renderRoadmap(data.advanced, "advanced", !advUnlocked)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Curriculum;
