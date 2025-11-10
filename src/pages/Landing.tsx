import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";
import aiTutorIcon from "@/assets/ai-tutor-icon.png";
import pronunciationIcon from "@/assets/pronunciation-icon.png";
import grammarIcon from "@/assets/grammar-icon.png";
import { MessageSquare, GraduationCap, Mic, FileText, Users, Trophy } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                E-Speak — Your English Learning Companion
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Speak English{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Confidently
                </span>
              </h1>
              <p className="text-lg text-muted-foreground md:text-xl max-w-2xl">
                From "Hello" to fluent — focused English learning with AI-powered tutoring, 
                pronunciation practice, and interactive lessons. Safe, friendly, and designed just for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="hero" 
                  size="lg" 
                  onClick={() => navigate("/onboarding")}
                  className="text-lg px-8 py-6"
                >
                  Start Learning Free
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-6"
                >
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 blur-3xl rounded-full" />
              <img 
                src={heroImage} 
                alt="Students learning English together"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 md:text-4xl">
              Everything You Need to Master English
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and features designed to take you from beginner to advanced fluency
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <img src={aiTutorIcon} alt="AI Tutor" className="w-16 h-16 mb-4" />
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  AI Tutor Chatbot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Chat with your personal AI tutor 24/7. Get instant help with vocabulary, 
                  grammar, and practice real conversations.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <img src={pronunciationIcon} alt="Pronunciation" className="w-16 h-16 mb-4" />
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5 text-primary" />
                  Pronunciation Trainer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Record your voice, get instant feedback on your pronunciation, 
                  and practice until perfect with phoneme-level corrections.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <img src={grammarIcon} alt="Grammar" className="w-16 h-16 mb-4" />
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Grammar Correction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Write or speak, and get instant corrections with clear explanations 
                  and tips to avoid similar mistakes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <GraduationCap className="h-16 w-16 mb-4 text-primary" />
                <CardTitle>Video Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Access hundreds of video lessons organized by level and topic, 
                  from quick tips to full lectures.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <Users className="h-16 w-16 mb-4 text-primary" />
                <CardTitle>Discussion Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Practice debates and discussions in a safe environment with 
                  pre-approved topics and AI guidance.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all hover:scale-105">
              <CardHeader>
                <Trophy className="h-16 w-16 mb-4 text-primary" />
                <CardTitle>Tests & Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Track your progress with quizzes, exams, and achievements. 
                  Build streaks and compete on leaderboards.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
            <CardContent className="relative p-12 text-center">
              <h2 className="text-3xl font-bold mb-4 md:text-4xl">
                Ready to Start Your English Journey?
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are speaking English confidently with E-Speak. 
                Start for free today — no credit card required.
              </p>
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/onboarding")}
                className="text-lg px-8 py-6"
              >
                Get Started Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Landing;
