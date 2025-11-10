import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Lessons = () => {
  const navigate = useNavigate();

  const lessons = [
    {
      title: "Introducing Yourself",
      duration: "5 min",
      level: "Beginner",
      completed: true,
      thumbnail: "bg-gradient-to-br from-primary/20 to-accent/20",
    },
    {
      title: "Daily Routines",
      duration: "6 min",
      level: "Beginner",
      completed: false,
      thumbnail: "bg-gradient-to-br from-accent/20 to-primary/20",
    },
    {
      title: "Food and Recipes",
      duration: "7 min",
      level: "Intermediate",
      completed: false,
      thumbnail: "bg-gradient-to-br from-primary/30 to-accent/30",
    },
    {
      title: "Travel and Directions",
      duration: "8 min",
      level: "Intermediate",
      completed: false,
      thumbnail: "bg-gradient-to-br from-accent/30 to-primary/30",
    },
    {
      title: "Professional English",
      duration: "10 min",
      level: "Advanced",
      completed: false,
      thumbnail: "bg-gradient-to-br from-primary/40 to-accent/40",
    },
  ];

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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Video Lessons
          </h1>
          <p className="text-muted-foreground text-lg">
            Watch curated lessons to improve your English
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson, idx) => (
            <Card key={idx} className="group hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
              <div className={`h-48 ${lesson.thumbnail} flex items-center justify-center relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all" />
                <Play className="h-16 w-16 text-white relative z-10 group-hover:scale-110 transition-transform" />
                {lesson.completed && (
                  <div className="absolute top-3 right-3 bg-primary rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{lesson.level}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {lesson.duration}
                  </div>
                </div>
                <CardTitle className="text-xl">{lesson.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant={lesson.completed ? "outline" : "default"}>
                  {lesson.completed ? "Watch Again" : "Start Lesson"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lessons;
