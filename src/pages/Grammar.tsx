import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const GRAMMAR_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/grammar-check`;

type GrammarError = {
  mistake: string;
  original?: string;
  fix?: string;
  explanation: string;
};

type GrammarResult = {
  corrected: string;
  errors: GrammarError[];
  tip: string;
  score: number;
};

const Grammar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<GrammarResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setCorrections(null);

    try {
      const resp = await fetch(GRAMMAR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to check grammar");
      }

      const data: GrammarResult = await resp.json();
      setCorrections(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to check grammar",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent! 🌟";
    if (score >= 70) return "Good job! 👍";
    if (score >= 50) return "Keep practicing! 💪";
    return "Needs work 📚";
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Grammar Check
          </h1>
          <p className="text-muted-foreground text-lg">
            AI-powered grammar corrections and explanations
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Write Your Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type or paste your English text here... For example: 'I dont think she go to school yesterday because she dont feel good.'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[180px] text-base"
            />
            <Button
              onClick={handleCheck}
              disabled={!text.trim() || isLoading}
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Check Grammar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {corrections && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Grammar Score</p>
                    <p className={`text-5xl font-bold ${getScoreColor(corrections.score)}`}>
                      {corrections.score}
                    </p>
                    <p className="text-lg mt-1">{getScoreLabel(corrections.score)}</p>
                  </div>
                  <div className="w-32">
                    <Progress value={corrections.score} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Corrected Version */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Corrected Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed bg-secondary/30 p-4 rounded-lg">
                  {corrections.corrected}
                </p>
              </CardContent>
            </Card>

            {/* Errors */}
            {corrections.errors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-accent" />
                    Errors & Fixes ({corrections.errors.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {corrections.errors.map((error, idx) => (
                    <div
                      key={idx}
                      className="border-l-4 border-accent pl-4 py-2 bg-accent/5 rounded-r-lg"
                    >
                      <p className="font-semibold text-accent">{error.mistake}</p>
                      {error.original && error.fix && (
                        <p className="text-sm mt-1">
                          <span className="line-through text-destructive">{error.original}</span>
                          {" → "}
                          <span className="text-primary font-medium">{error.fix}</span>
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">{error.explanation}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tip */}
            <Card className="bg-secondary/50">
              <CardContent className="p-6">
                <p className="font-semibold mb-2">💡 Grammar Tip:</p>
                <p className="text-muted-foreground">{corrections.tip}</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grammar;
