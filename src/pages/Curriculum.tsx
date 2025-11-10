import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, CheckCircle2, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Curriculum = () => {
  const navigate = useNavigate();

  const topics = {
    beginner: [
      { title: "Introducing yourself", lessons: 8, completed: 8, locked: false },
      { title: "Daily routines", lessons: 6, completed: 4, locked: false },
      { title: "Hobbies and interests", lessons: 7, completed: 0, locked: false },
      { title: "Family and relationships", lessons: 8, completed: 0, locked: true },
      { title: "Food and recipes", lessons: 9, completed: 0, locked: true },
      { title: "Shopping and money basics", lessons: 7, completed: 0, locked: true },
      { title: "Weather and seasons", lessons: 5, completed: 0, locked: true },
      { title: "Making plans & invitations", lessons: 6, completed: 0, locked: true },
    ],
    intermediate: [
      { title: "Travel and directions", lessons: 10, completed: 0, locked: false },
      { title: "Work and jobs", lessons: 12, completed: 0, locked: false },
      { title: "Technology basics", lessons: 8, completed: 0, locked: false },
      { title: "Health & fitness tips", lessons: 9, completed: 0, locked: true },
      { title: "Social media etiquette", lessons: 7, completed: 0, locked: true },
      { title: "Sports and leisure", lessons: 8, completed: 0, locked: true },
      { title: "Environment & recycling", lessons: 10, completed: 0, locked: true },
      { title: "Home & living", lessons: 9, completed: 0, locked: true },
    ],
    advanced: [
      { title: "Professional English", lessons: 15, completed: 0, locked: false },
      { title: "Debates & discussions", lessons: 12, completed: 0, locked: false },
      { title: "Business communication", lessons: 14, completed: 0, locked: true },
      { title: "Cultural nuances", lessons: 10, completed: 0, locked: true },
      { title: "Advanced idioms", lessons: 11, completed: 0, locked: true },
      { title: "Academic writing", lessons: 13, completed: 0, locked: true },
    ],
  };

  const renderTopics = (topicList: any[]) => (
    <div className="grid gap-4 md:grid-cols-2">
      {topicList.map((topic, idx) => (
        <Card
          key={idx}
          className={`group transition-all ${
            topic.locked ? "opacity-60" : "hover:shadow-xl hover:scale-105 cursor-pointer"
          }`}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {topic.locked ? (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  ) : topic.completed === topic.lessons ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-primary" />
                  )}
                  {topic.title}
                </CardTitle>
                <CardDescription className="mt-1">
                  {topic.lessons} lessons
                  {topic.completed > 0 && ` • ${topic.completed} completed`}
                </CardDescription>
              </div>
              {topic.completed === topic.lessons && (
                <Badge className="bg-primary">Complete</Badge>
              )}
              {topic.locked && <Badge variant="outline">Locked</Badge>}
            </div>
          </CardHeader>
          <CardContent>
            {!topic.locked && (
              <div className="space-y-3">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all"
                    style={{ width: `${(topic.completed / topic.lessons) * 100}%` }}
                  />
                </div>
                <Button variant="default" className="w-full">
                  {topic.completed > 0 ? "Continue" : "Start Topic"}
                </Button>
              </div>
            )}
            {topic.locked && (
              <p className="text-sm text-muted-foreground">
                Complete previous topics to unlock
              </p>
            )}
          </CardContent>
        </Card>
      ))}
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
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Learning Curriculum
          </h1>
          <p className="text-muted-foreground text-lg">
            25+ topics organized by difficulty level
          </p>
        </div>

        <Tabs defaultValue="beginner" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="beginner">Beginner</TabsTrigger>
            <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="beginner">{renderTopics(topics.beginner)}</TabsContent>
          <TabsContent value="intermediate">{renderTopics(topics.intermediate)}</TabsContent>
          <TabsContent value="advanced">{renderTopics(topics.advanced)}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Curriculum;
