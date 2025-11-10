import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const Pronunciation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const sentences = [
    "The weather is beautiful today.",
    "I would like to order a coffee, please.",
    "Practice makes perfect.",
    "She sells seashells by the seashore.",
    "How do you pronounce this word?"
  ];

  const [currentSentence] = useState(sentences[0]);

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setHasRecorded(true);
      // Simulate score
      const randomScore = Math.floor(Math.random() * 20) + 80;
      setScore(randomScore);
      toast({
        title: "Recording Analyzed",
        description: `Your pronunciation score: ${randomScore}/100`,
      });
    } else {
      setIsRecording(true);
      setScore(null);
      toast({
        title: "Recording Started",
        description: "Speak clearly into your microphone",
      });
    }
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
            Pronunciation Practice
          </h1>
          <p className="text-muted-foreground text-lg">
            Listen, record, and improve your pronunciation
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Today's Sentence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <p className="text-2xl font-medium text-center mb-4">{currentSentence}</p>
              <Button variant="outline" className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Listen to Native Speaker
              </Button>
            </div>

            <div className="text-center space-y-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={handleRecord}
                className="w-full h-20 text-lg"
              >
                {isRecording ? (
                  <>
                    <Square className="h-6 w-6 mr-3" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-3" />
                    {hasRecorded ? "Record Again" : "Start Recording"}
                  </>
                )}
              </Button>

              {score !== null && (
                <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                  <CardContent className="p-6">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Your Score</p>
                      <p className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {score}
                      </p>
                      <p className="text-2xl text-muted-foreground">/100</p>
                    </div>
                    <Progress value={score} className="h-3 mb-4" />
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Feedback:</p>
                      <p className="text-muted-foreground">✓ Good stress patterns</p>
                      <p className="text-muted-foreground">✓ Clear consonant sounds</p>
                      <p className="text-muted-foreground">→ Work on vowel length in "beautiful"</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pronunciation;
