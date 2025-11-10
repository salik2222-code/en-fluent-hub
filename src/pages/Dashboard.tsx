import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { MessageSquare, Mic, FileText, Video, Users, BookOpen, Trophy, Settings } from "lucide-react";

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
    {
      title: "AI Tutor Chat",
      description: "Practice conversation with your personal AI tutor",
      icon: MessageSquare,
      path: "/tutor",
      color: "text-primary",
      bgColor: "bg-primary/10",
      available: true,
    },
    {
      title: "Pronunciation",
      description: "Record and improve your pronunciation",
      icon: Mic,
      path: "/pronunciation",
      color: "text-accent",
      bgColor: "bg-accent/10",
      available: false,
    },
    {
      title: "Grammar Check",
      description: "Get instant grammar corrections",
      icon: FileText,
      path: "/grammar",
      color: "text-primary",
      bgColor: "bg-primary/10",
      available: false,
    },
    {
      title: "Video Lessons",
      description: "Watch curated video lessons",
      icon: Video,
      path: "/lessons",
      color: "text-accent",
      bgColor: "bg-accent/10",
      available: false,
    },
    {
      title: "Discussion Mode",
      description: "Practice debates on safe topics",
      icon: Users,
      path: "/discussion",
      color: "text-primary",
      bgColor: "bg-primary/10",
      available: false,
    },
    {
      title: "Curriculum",
      description: "Browse 25+ learning topics",
      icon: BookOpen,
      path: "/curriculum",
      color: "text-accent",
      bgColor: "bg-accent/10",
      available: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
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
        {/* Welcome Section */}
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

        {/* Daily Goal */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-accent" />
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Practice 15 minutes today</span>
                <span className="text-muted-foreground">8/15 min</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all" style={{ width: "53%" }} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Learning Tools</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className={`group transition-all hover:shadow-xl ${
                    feature.available ? "cursor-pointer hover:scale-105" : "opacity-60"
                  }`}
                  onClick={() => feature.available && navigate(feature.path)}
                >
                  <CardHeader>
                    <div className={`w-14 h-14 ${feature.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <CardTitle className="flex items-center justify-between">
                      {feature.title}
                      {!feature.available && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-full font-normal">
                          Coming Soon
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
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
