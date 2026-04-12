import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Coffee, MessageSquare, Briefcase, Plane, Globe, GraduationCap, Heart, Trophy, Quote, Monitor, Users, ShoppingCart, Clock, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

type Goal = { id: string; title: string; description: string };
type LevelData = { title: string; icon: React.ElementType; goals: Goal[] };

const roadmapData: Record<string, LevelData[]> = {
  beginner: [
    { title: "Greetings & Introductions", icon: Coffee, goals: [
      { id: "b-0-0", title: "Say Hello & Goodbye", description: "Greet someone and end a conversation" },
      { id: "b-0-1", title: "Introduce Yourself", description: "Tell someone your name, age, and hometown" },
      { id: "b-0-2", title: "Ask About Others", description: "Ask basic questions: name, job, country" },
    ]},
    { title: "Numbers, Time & Dates", icon: Hash, goals: [
      { id: "b-1-0", title: "Count from 1 to 100", description: "Say numbers confidently" },
      { id: "b-1-1", title: "Tell the Time", description: "Answer 'What time is it?'" },
      { id: "b-1-2", title: "Say Today's Date", description: "Use months, days, and years" },
    ]},
    { title: "Daily Routines", icon: Clock, goals: [
      { id: "b-2-0", title: "Describe Your Morning", description: "Use Simple Present: I wake up, I brush..." },
      { id: "b-2-1", title: "Talk About Your Day", description: "Describe work/school activities" },
      { id: "b-2-2", title: "Describe Your Evening", description: "What you do after work/school" },
    ]},
    { title: "Family & Home", icon: Users, goals: [
      { id: "b-3-0", title: "Name Family Members", description: "Mother, father, brother, sister, etc." },
      { id: "b-3-1", title: "Describe Your Home", description: "Rooms, furniture, and items" },
      { id: "b-3-2", title: "Talk About Your Family", description: "Short paragraph about your family" },
    ]},
    { title: "Food & Shopping", icon: ShoppingCart, goals: [
      { id: "b-4-0", title: "Order Coffee in English", description: "At a cafe: size, milk, sugar" },
      { id: "b-4-1", title: "Ask for Prices", description: "How much is this? That costs..." },
      { id: "b-4-2", title: "Describe Your Favorite Food", description: "I like / I prefer / My favorite is..." },
    ]},
  ],
  intermediate: [
    { title: "Past Experiences", icon: Clock, goals: [
      { id: "i-0-0", title: "Tell a Childhood Story", description: "Use Past Simple and Past Continuous" },
      { id: "i-0-1", title: "Describe a Trip You Took", description: "Narrate a travel experience" },
      { id: "i-0-2", title: "Compare Past & Present", description: "Use 'used to' and 'now I...'" },
    ]},
    { title: "Work & Career", icon: Briefcase, goals: [
      { id: "i-1-0", title: "Explain Your Job", description: "What do you do? I work as a..." },
      { id: "i-1-1", title: "Handle a Job Interview", description: "Answer common interview questions" },
      { id: "i-1-2", title: "Write a Professional Email", description: "Formal greeting, body, closing" },
    ]},
    { title: "Health & Fitness", icon: Heart, goals: [
      { id: "i-2-0", title: "Describe Symptoms to a Doctor", description: "I have a headache, my throat hurts..." },
      { id: "i-2-1", title: "Talk About Exercise", description: "I go running, I work out..." },
      { id: "i-2-2", title: "Give Health Advice", description: "You should... It's better to..." },
    ]},
    { title: "Travel & Culture", icon: Plane, goals: [
      { id: "i-3-0", title: "Navigate an Airport", description: "Check-in, boarding, customs" },
      { id: "i-3-1", title: "Book a Hotel Room", description: "Reservation, check-in, requests" },
      { id: "i-3-2", title: "Ask for Directions", description: "Where is...? Turn left, go straight..." },
    ]},
    { title: "Expressing Opinions", icon: MessageSquare, goals: [
      { id: "i-4-0", title: "Share Your Opinion", description: "I think... In my view... I believe..." },
      { id: "i-4-1", title: "Agree and Disagree Politely", description: "I see your point, but... / I agree because..." },
      { id: "i-4-2", title: "Summarize a Discussion", description: "In conclusion... To sum up..." },
    ]},
  ],
  advanced: [
    { title: "Business Negotiations", icon: Trophy, goals: [
      { id: "a-0-0", title: "Open a Negotiation", description: "Set the tone and establish goals" },
      { id: "a-0-1", title: "Handle Objections", description: "I understand your concern, however..." },
      { id: "a-0-2", title: "Close a Deal", description: "Let's finalize... We've agreed that..." },
    ]},
    { title: "Public Speaking", icon: Monitor, goals: [
      { id: "a-1-0", title: "Give a 2-Minute Speech", description: "Structure: intro, body, conclusion" },
      { id: "a-1-1", title: "Handle Q&A Confidently", description: "That's a great question... Let me clarify..." },
      { id: "a-1-2", title: "Use Persuasive Language", description: "Rhetorical questions, power words" },
    ]},
    { title: "Complex Discussions", icon: Globe, goals: [
      { id: "a-2-0", title: "Discuss Technology Trends", description: "AI, remote work, digital transformation" },
      { id: "a-2-1", title: "Debate Environmental Issues", description: "Present arguments with evidence" },
      { id: "a-2-2", title: "Analyze Education Systems", description: "Compare, contrast, evaluate" },
    ]},
    { title: "Idioms & Native Expressions", icon: Quote, goals: [
      { id: "a-3-0", title: "Use 10 Common Idioms", description: "Break the ice, hit the nail on the head..." },
      { id: "a-3-1", title: "Understand Slang in Context", description: "Gonna, wanna, ain't, no biggie..." },
      { id: "a-3-2", title: "Use Phrasal Verbs Naturally", description: "Look into, come up with, figure out..." },
    ]},
    { title: "Academic & Professional Writing", icon: GraduationCap, goals: [
      { id: "a-4-0", title: "Write a Thesis Statement", description: "Clear, arguable, specific" },
      { id: "a-4-1", title: "Structure an Essay", description: "Introduction, body paragraphs, conclusion" },
      { id: "a-4-2", title: "Paraphrase Without Plagiarizing", description: "Rewrite ideas in your own words" },
    ]},
  ],
};

const STORAGE_KEY = "espeak-roadmap";

function loadDone(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const Roadmap = () => {
  const navigate = useNavigate();
  const [done, setDone] = useState<Record<string, boolean>>(loadDone);
  const [activeTab, setActiveTab] = useState("beginner");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  }, [done]);

  const toggle = (id: string) => {
    setDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getLevelProgress = (level: string) => {
    const topics = roadmapData[level];
    const total = topics.reduce((a, t) => a + t.goals.length, 0);
    const completed = topics.reduce((a, t) => a + t.goals.filter((g) => done[g.id]).length, 0);
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const beginnerPct = getLevelProgress("beginner");
  const isIntermediateLocked = beginnerPct < 80;
  const intermediaPct = getLevelProgress("intermediate");
  const isAdvancedLocked = intermediaPct < 80 || isIntermediateLocked;

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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Learning Roadmap</h1>
          <p className="text-muted-foreground text-lg">Your step-by-step English learning journey</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate" disabled={isIntermediateLocked}>
              {isIntermediateLocked && <Lock className="h-3 w-3 mr-1" />}Intermediate
            </TabsTrigger>
            <TabsTrigger value="advanced" disabled={isAdvancedLocked}>
              {isAdvancedLocked && <Lock className="h-3 w-3 mr-1" />}Advanced
            </TabsTrigger>
          </TabsList>

          {(["beginner", "intermediate", "advanced"] as const).map((level) => {
            const pct = getLevelProgress(level);
            const topics = roadmapData[level];
            return (
              <TabsContent key={level} value={level}>
                <Card className="mb-6 bg-gradient-to-r from-primary/5 to-accent/5">
                  <CardContent className="p-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium capitalize">{level} Progress</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-3" />
                    {level !== "advanced" && pct < 80 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Reach 80% to unlock the next level
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

                  <div className="space-y-8">
                    {topics.map((topic, tIdx) => {
                      const Icon = topic.icon;
                      const topicDone = topic.goals.filter((g) => done[g.id]).length;
                      const topicTotal = topic.goals.length;
                      return (
                        <div key={tIdx} className="relative pl-16">
                          {/* Timeline dot */}
                          <div className="absolute left-3.5 top-1 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                            {topicDone === topicTotal ? (
                              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                            ) : null}
                          </div>

                          <Card className="overflow-hidden">
                            <CardContent className="p-5">
                              <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-semibold">{topic.title}</h3>
                                  <p className="text-xs text-muted-foreground">{topicDone}/{topicTotal} goals completed</p>
                                </div>
                                <Badge variant={topicDone === topicTotal ? "default" : "outline"}>
                                  {topicDone === topicTotal ? "Done ✓" : `${topicDone}/${topicTotal}`}
                                </Badge>
                              </div>
                              <div className="space-y-3">
                                {topic.goals.map((goal) => (
                                  <div
                                    key={goal.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer ${
                                      done[goal.id] ? "bg-primary/5" : "bg-secondary/30 hover:bg-secondary/50"
                                    }`}
                                    onClick={() => toggle(goal.id)}
                                  >
                                    <Checkbox
                                      checked={!!done[goal.id]}
                                      onCheckedChange={() => toggle(goal.id)}
                                      className="mt-0.5"
                                    />
                                    <div>
                                      <p className={`text-sm font-medium ${done[goal.id] ? "line-through text-muted-foreground" : ""}`}>
                                        {goal.title}
                                      </p>
                                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
};

export default Roadmap;
