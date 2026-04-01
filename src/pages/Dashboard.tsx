import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageSquare, Mic, FileText, Video, Users, BookOpen, Trophy, Settings } from "lucide-react";
import DailyGoalTracker from "@/components/DailyGoalTracker";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userLevel, setUserLevel] = useState<string>("beginner");

  useEffect(() => {
    const level = localStorage.getItem("userLevel");
    if (!level) {
      navigate("/onboarding");
    } else {
      setUserLevel(level);
    }
  }, [navigate]);

  const features = [
    { title: "AI Tutor Chat", description: "Practice conversation with your personal AI tutor", icon: MessageSquare, path: "/tutor", gradient: "from-primary/20 via-primary/10 to-transparent" },
    { title: "Pronunciation", description: "Record and improve your pronunciation", icon: Mic, path: "/pronunciation", gradient: "from-accent/20 via-accent/10 to-transparent" },
    { title: "Grammar Check", description: "Get instant grammar corrections", icon: FileText, path: "/grammar", gradient: "from-primary/20 via-primary/10 to-transparent" },
    { title: "Video Lessons", description: "Watch curated video lessons", icon: Video, path: "/lessons", gradient: "from-accent/20 via-accent/10 to-transparent" },
    { title: "Discussion Mode", description: "Practice debates on safe topics", icon: Users, path: "/discussion", gradient: "from-primary/20 via-primary/10 to-transparent" },
    { title: "Curriculum", description: "Browse 15 topics across 3 levels", icon: BookOpen, path: "/curriculum", gradient: "from-accent/20 via-accent/10 to-transparent" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                E-Speak
              </h1>
              <span className="text-sm bg-secondary px-3 py-1 rounded-full capitalize">
                {userLevel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Trophy className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-2">Welcome back! 👋</h2>
            <p className="text-muted-foreground mb-4">
              Ready to continue your English learning journey? Pick a feature below to get started.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>5 day streak 🔥</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent" />
                <span>12 lessons completed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <DailyGoalTracker />

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Learning Tools</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="group relative overflow-hidden cursor-pointer hover:shadow-2xl transition-all hover:scale-[1.02] border-2 border-transparent hover:border-primary/20"
                  onClick={() => navigate(feature.path)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardHeader className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary/30 to-accent/30 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" onClick={() => navigate("/tutor")} className="flex-1">
              Continue with AI Tutor
            </Button>
            <Button variant="outline" className="flex-1">
              Take a Quick Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
