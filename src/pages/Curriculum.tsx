import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ArrowLeft, BookOpen, CheckCircle2, Lock, Coffee, Hash, CalendarDays, Users, ShoppingCart, Clock, Briefcase, Heart, Plane, MessageCircle, Trophy, Monitor, Globe, Quote, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Lesson = { id: string; title: string; done: boolean };
type Topic = {
  title: string;
  icon: React.ElementType;
  lessons: Lesson[];
};
type CurriculumData = { beginner: Topic[]; intermediate: Topic[]; advanced: Topic[] };

const makeLessons = (count: number, topicIdx: number, level: string): Lesson[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${level}-${topicIdx}-${i}`,
    title: `Lesson ${i + 1}`,
    done: false,
  }));

const defaultCurriculum: CurriculumData = {
  beginner: [
    { title: "Greetings & Introductions", icon: Coffee, lessons: makeLessons(5, 0, "b") },
    { title: "Numbers, Time & Dates", icon: Hash, lessons: makeLessons(4, 1, "b") },
    { title: "Daily Routines", icon: CalendarDays, lessons: makeLessons(6, 2, "b") },
    { title: "Family & Home", icon: Users, lessons: makeLessons(5, 3, "b") },
    { title: "Food & Shopping", icon: ShoppingCart, lessons: makeLessons(6, 4, "b") },
  ],
  intermediate: [
    { title: "Past Experiences", icon: Clock, lessons: makeLessons(7, 0, "i") },
    { title: "Work & Career", icon: Briefcase, lessons: makeLessons(6, 1, "i") },
    { title: "Health & Fitness", icon: Heart, lessons: makeLessons(5, 2, "i") },
    { title: "Travel & Culture", icon: Plane, lessons: makeLessons(8, 3, "i") },
    { title: "Expressing Opinions", icon: MessageCircle, lessons: makeLessons(7, 4, "i") },
  ],
  advanced: [
    { title: "Business Negotiations", icon: Trophy, lessons: makeLessons(10, 0, "a") },
    { title: "Public Speaking", icon: Monitor, lessons: makeLessons(8, 1, "a") },
    { title: "Social Issues & Debates", icon: Globe, lessons: makeLessons(9, 2, "a") },
    { title: "Idioms & Slang", icon: Quote, lessons: makeLessons(7, 3, "a") },
    { title: "Academic Writing & Ethics", icon: GraduationCap, lessons: makeLessons(10, 4, "a") },
  ],
};

const STORAGE_KEY = "espeak-curriculum";

function loadProgress(): CurriculumData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultCurriculum;
    const saved = JSON.parse(raw) as Record<string, Record<string, boolean>>;
    const data = JSON.parse(JSON.stringify(defaultCurriculum)) as CurriculumData;
    for (const level of ["beginner", "intermediate", "advanced"] as const) {
      for (const topic of data[level]) {
        for (const lesson of topic.lessons) {
          if (saved[lesson.id]) lesson.done = true;
        }
      }
    }
    return data;
  } catch {
    return defaultCurriculum;
  }
}

function saveProgress(data: CurriculumData) {
  const map: Record<string, boolean> = {};
  for (const level of ["beginner", "intermediate", "advanced"] as const) {
    for (const topic of data[level]) {
      for (const lesson of topic.lessons) {
        if (lesson.done) map[lesson.id] = true;
      }
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

function getLevelPercent(topics: Topic[]): number {
  let done = 0, total = 0;
  for (const t of topics) {
    for (const l of t.lessons) {
      total++;
      if (l.done) done++;
    }
  }
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

const Curriculum = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<CurriculumData>(loadProgress);
  const [selectedTopic, setSelectedTopic] = useState<{ level: string; topicIdx: number } | null>(null);

  useEffect(() => { saveProgress(data); }, [data]);

  const beginnerPercent = getLevelPercent(data.beginner);
  const intermediateUnlocked = beginnerPercent >= 80;
  const intermediatePercent = getLevelPercent(data.intermediate);
  const advancedUnlocked = intermediateUnlocked && intermediatePercent >= 80;

  const toggleLesson = useCallback((level: string, topicIdx: number, lessonIdx: number) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev)) as CurriculumData;
      const lvl = level as keyof CurriculumData;
      next[lvl][topicIdx].lessons[lessonIdx].done = !next[lvl][topicIdx].lessons[lessonIdx].done;
      return next;
    });
  }, []);

  const openTopic = selectedTopic
    ? data[selectedTopic.level as keyof CurriculumData][selectedTopic.topicIdx]
    : null;

  const renderTopics = (topicList: Topic[], level: string, locked: boolean) => (
    <div className="space-y-4">
      {locked && (
        <div className="text-center py-6 text-muted-foreground">
          <Lock className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="font-medium">Complete 80% of the previous level to unlock</p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {topicList.map((topic, idx) => {
          const completed = topic.lessons.filter((l) => l.done).length;
          const total = topic.lessons.length;
          const pct = Math.round((completed / total) * 100);
          const Icon = topic.icon;
          const isDone = completed === total;
          return (
            <Card
              key={idx}
              className={`group transition-all ${
                locked ? "opacity-40 pointer-events-none" : "hover:shadow-xl hover:scale-[1.02] cursor-pointer"
              }`}
              onClick={() => !locked && setSelectedTopic({ level, topicIdx: idx })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDone ? "bg-primary/20" : "bg-secondary"}`}>
                      {isDone ? <CheckCircle2 className="h-6 w-6 text-primary" /> : <Icon className="h-6 w-6 text-primary" />}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{topic.title}</CardTitle>
                      <CardDescription>{total} lessons • {completed} done</CardDescription>
                    </div>
                  </div>
                  {isDone && <Badge className="bg-primary text-primary-foreground">Complete</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">{pct}% complete</span>
                    <Button variant="default" size="sm" onClick={(e) => { e.stopPropagation(); !locked && setSelectedTopic({ level, topicIdx: idx }); }}>
                      {completed > 0 ? "Continue" : "Start"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Learning Curriculum
          </h1>
          <p className="text-muted-foreground text-lg">
            3-tier English Learning Path • 15 topics • 100+ lessons
          </p>
        </div>

        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="beginner">
              Beginner ({beginnerPercent}%)
            </TabsTrigger>
            <TabsTrigger value="intermediate">
              Intermediate {!intermediateUnlocked && "🔒"}
            </TabsTrigger>
            <TabsTrigger value="advanced">
              Advanced {!advancedUnlocked && "🔒"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="beginner">{renderTopics(data.beginner, "beginner", false)}</TabsContent>
          <TabsContent value="intermediate">{renderTopics(data.intermediate, "intermediate", !intermediateUnlocked)}</TabsContent>
          <TabsContent value="advanced">{renderTopics(data.advanced, "advanced", !advancedUnlocked)}</TabsContent>
        </Tabs>
      </div>

      {/* Lesson detail dialog */}
      <Dialog open={!!selectedTopic} onOpenChange={(open) => !open && setSelectedTopic(null)}>
        <DialogContent className="max-w-md">
          {openTopic && selectedTopic && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <openTopic.icon className="h-5 w-5 text-primary" />
                  {openTopic.title}
                </DialogTitle>
                <DialogDescription>
                  {openTopic.lessons.filter((l) => l.done).length}/{openTopic.lessons.length} lessons completed
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {openTopic.lessons.map((lesson, lIdx) => (
                  <div
                    key={lesson.id}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      lesson.done ? "bg-primary/10 border-primary/30" : "bg-card border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        lesson.done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                      }`}>
                        {lesson.done ? "✓" : lIdx + 1}
                      </div>
                      <span className={`text-sm font-medium ${lesson.done ? "text-primary" : ""}`}>{lesson.title}</span>
                    </div>
                    <Button
                      size="sm"
                      variant={lesson.done ? "outline" : "default"}
                      onClick={() => toggleLesson(selectedTopic.level, selectedTopic.topicIdx, lIdx)}
                      className="text-xs"
                    >
                      {lesson.done ? "Undo" : "Complete"}
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Curriculum;
