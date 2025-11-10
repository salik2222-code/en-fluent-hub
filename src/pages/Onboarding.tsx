import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Star, Rocket } from "lucide-react";

type Level = "beginner" | "intermediate" | "advanced" | null;

const Onboarding = () => {
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (selectedLevel) {
      localStorage.setItem("userLevel", selectedLevel);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 md:text-5xl">
            Assalamu Alaikum — Welcome to{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              E-Speak
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose your level to start your English learning journey. 
            Don't worry, you can always change this later!
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedLevel === "beginner" 
                ? "ring-2 ring-primary shadow-xl scale-105" 
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedLevel("beginner")}
          >
            <CardHeader className="text-center">
              <GraduationCap className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Beginner</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">
                Just starting out? Perfect! We'll help you learn the basics: 
                greetings, simple sentences, and everyday vocabulary.
              </CardDescription>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>✓ Basic vocabulary</p>
                <p>✓ Simple grammar</p>
                <p>✓ Common phrases</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedLevel === "intermediate" 
                ? "ring-2 ring-primary shadow-xl scale-105" 
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedLevel("intermediate")}
          >
            <CardHeader className="text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Intermediate</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">
                You know the basics and want to improve. We'll focus on 
                building fluency and confidence in conversations.
              </CardDescription>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>✓ Complex sentences</p>
                <p>✓ Natural conversations</p>
                <p>✓ Idioms & expressions</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            className={`cursor-pointer transition-all hover:shadow-xl ${
              selectedLevel === "advanced" 
                ? "ring-2 ring-primary shadow-xl scale-105" 
                : "hover:scale-105"
            }`}
            onClick={() => setSelectedLevel("advanced")}
          >
            <CardHeader className="text-center">
              <Rocket className="h-16 w-16 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl">Advanced</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <CardDescription className="text-base">
                Already fluent? Let's perfect your English with advanced 
                discussions, business English, and nuanced language.
              </CardDescription>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <p>✓ Professional English</p>
                <p>✓ Debates & discussions</p>
                <p>✓ Cultural nuances</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            variant="hero" 
            size="lg"
            disabled={!selectedLevel}
            onClick={handleContinue}
            className="text-lg px-12 py-6"
          >
            {selectedLevel ? `Continue as ${selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)}` : "Choose Your Level"}
          </Button>
        </div>

        <div className="mt-8 p-6 bg-secondary/50 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            🛡️ E-Speak keeps all interactions safe and focused on English learning. 
            No politics or controversial topics — just pure, effective language learning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
