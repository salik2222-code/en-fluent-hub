import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Discussion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = [
    { title: "Technology in Daily Life", difficulty: "Intermediate", participants: 3 },
    { title: "Travel Experiences", difficulty: "Beginner", participants: 5 },
    { title: "Health and Fitness", difficulty: "Intermediate", participants: 2 },
    { title: "Movies and Entertainment", difficulty: "Beginner", participants: 4 },
    { title: "Environmental Actions", difficulty: "Advanced", participants: 2 },
    { title: "Food Cultures", difficulty: "Intermediate", participants: 6 },
  ];

  const handleJoin = (topic: string) => {
    setSelectedTopic(topic);
    toast({
      title: "Joining Discussion",
      description: `Connecting you to "${topic}" discussion...`,
    });
  };

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
            Discussion Mode
          </h1>
          <p className="text-muted-foreground text-lg">
            Practice debates on safe, educational topics
          </p>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Discussion Guidelines</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Each participant gets 4 turns to speak</li>
                  <li>• Keep responses to 2 sentences maximum</li>
                  <li>• Stay focused on the chosen topic</li>
                  <li>• Receive feedback after the discussion ends</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic, idx) => (
            <Card
              key={idx}
              className="group hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
              onClick={() => handleJoin(topic.title)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{topic.difficulty}</Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {topic.participants}
                  </div>
                </div>
                <CardTitle className="text-xl">{topic.title}</CardTitle>
                <CardDescription>Join an active discussion on this topic</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  Join Discussion
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              Schedule a Private AI Debate
            </CardTitle>
            <CardDescription>
              Practice one-on-one with an AI opponent on any approved topic
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" size="lg" className="w-full">
              Start AI Debate Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Discussion;
