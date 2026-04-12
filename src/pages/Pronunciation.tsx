import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, ArrowLeft, Volume2, Loader2, RotateCcw, ChevronRight, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { pronunciationSentences } from "@/data/pronunciationSentences";
import { useTTS, useSTT } from "@/hooks/useSpeech";

const PRONUNCIATION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pronunciation-check`;

type FeedbackItem = { type: "correct" | "improvement"; text: string };
type IpaTip = { word: string; ipa: string; tip: string };
type PronunciationResult = { score: number; feedback: FeedbackItem[]; ipa_tips: IpaTip[]; overall: string };

const Pronunciation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, isSpeaking } = useTTS();
  const { startListening, stopListening, isListening } = useSTT();
  const [activeLevel, setActiveLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [levelIndex, setLevelIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [typedText, setTypedText] = useState("");

  // Daily goal timer
  useEffect(() => {
    const interval = setInterval(() => {
      const today = new Date().toDateString();
      const stored = localStorage.getItem("dailyGoal");
      const data = stored ? JSON.parse(stored) : { date: today, seconds: 0 };
      if (data.date !== today) { data.date = today; data.seconds = 0; }
      data.seconds += 1;
      localStorage.setItem("dailyGoal", JSON.stringify(data));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const filtered = pronunciationSentences.filter((s) => s.level === activeLevel);
  const currentSentence = filtered[levelIndex] || filtered[0];
  const totalInLevel = filtered.length;

  const handleListen = () => {
    speak(currentSentence.text, playbackSpeed);
  };

  const handleRecord = () => {
    if (isListening) { stopListening(); return; }
    startListening(
      async (transcript) => {
        setSpokenText(transcript);
        await analyzePronunciation(transcript);
      },
      (err) => toast({ title: "Error", description: err, variant: "destructive" })
    );
    setResult(null);
    setSpokenText("");
    toast({ title: "🎤 Recording", description: "Speak the sentence clearly..." });
  };

  const handleTextSubmit = async () => {
    if (!typedText.trim()) return;
    setSpokenText(typedText);
    await analyzePronunciation(typedText);
    // Read the correct version aloud after analysis
    speak(currentSentence.text);
  };

  const analyzePronunciation = async (spoken: string) => {
    setIsAnalyzing(true);
    try {
      const resp = await fetch(PRONUNCIATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ expected: currentSentence.text, spoken }),
      });
      if (!resp.ok) throw new Error("Analysis failed");
      const data: PronunciationResult = await resp.json();
      setResult(data);
    } catch {
      toast({ title: "Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally { setIsAnalyzing(false); }
  };

  const nextSentence = () => { setLevelIndex((p) => (p + 1) % totalInLevel); setResult(null); setSpokenText(""); setTypedText(""); };
  const handleLevelChange = (val: string) => { setActiveLevel(val as any); setLevelIndex(0); setResult(null); setSpokenText(""); setTypedText(""); };

  const getScoreColor = (score: number) => score >= 85 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-destructive";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}><ArrowLeft className="h-5 w-5 mr-2" />Back to Dashboard</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Pronunciation Practice</h1>
          <p className="text-muted-foreground text-lg">Dual Mode: Type or Speak — AI analyzes and corrects</p>
        </div>

        <Tabs value={activeLevel} onValueChange={handleLevelChange} className="mb-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="Beginner">Beginner</TabsTrigger>
            <TabsTrigger value="Intermediate">Intermediate</TabsTrigger>
            <TabsTrigger value="Advanced">Advanced</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sentence {levelIndex + 1} of {totalInLevel}</CardTitle>
            <Badge variant="outline">{activeLevel}</Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <p className="text-2xl font-medium text-center mb-6">{currentSentence.text}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Speed:</span>
                {[0.7, 1.0, 1.2].map((speed) => (
                  <Button key={speed} variant={playbackSpeed === speed ? "default" : "outline"} size="sm" onClick={() => setPlaybackSpeed(speed)} className="text-xs px-3">
                    {speed === 0.7 ? "Slow" : speed === 1.0 ? "Normal" : "Fast"}
                  </Button>
                ))}
              </div>
              <Button variant="outline" className="w-full" size="lg" onClick={handleListen} disabled={isSpeaking}>
                {isSpeaking ? <><Volume2 className="h-5 w-5 mr-2 animate-pulse" />Playing...</> : <><Play className="h-5 w-5 mr-2" />Listen</>}
              </Button>
            </div>

            {/* Mode switcher */}
            <div className="flex gap-2 mb-4">
              <Button variant={mode === "voice" ? "default" : "outline"} className="flex-1" onClick={() => setMode("voice")}>
                <Mic className="h-4 w-4 mr-2" />Voice Mode
              </Button>
              <Button variant={mode === "text" ? "default" : "outline"} className="flex-1" onClick={() => setMode("text")}>
                <Type className="h-4 w-4 mr-2" />Text Mode
              </Button>
            </div>

            <div className="space-y-4">
              {mode === "voice" ? (
                <Button size="lg" variant={isListening ? "destructive" : "default"} onClick={handleRecord} disabled={isAnalyzing} className="w-full h-20 text-lg">
                  {isAnalyzing ? <><Loader2 className="h-6 w-6 mr-3 animate-spin" />Analyzing...</> : isListening ? <><Square className="h-6 w-6 mr-3" />Stop Recording</> : <><Mic className="h-6 w-6 mr-3" />{result ? "Record Again" : "Start Recording"}</>}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Textarea value={typedText} onChange={(e) => setTypedText(e.target.value)} placeholder="Type the sentence here..." className="min-h-[80px]" />
                  <Button size="lg" onClick={handleTextSubmit} disabled={!typedText.trim() || isAnalyzing} className="w-full">
                    {isAnalyzing ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Analyzing...</> : "Check & Listen to Correct Version"}
                  </Button>
                </div>
              )}

              {spokenText && (
                <Card className="bg-secondary/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">{mode === "voice" ? "What we heard:" : "What you typed:"}</p>
                    <p className="text-lg">{spokenText}</p>
                  </CardContent>
                </Card>
              )}

              {result && (
                <div className="space-y-4 animate-fade-in">
                  <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Score</p>
                        <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
                        <p className="text-2xl text-muted-foreground">/100</p>
                      </div>
                      <Progress value={result.score} className="h-3 mb-4" />
                      <p className="text-center text-muted-foreground">{result.overall}</p>
                      <Button variant="ghost" size="sm" className="w-full mt-3" onClick={() => speak(currentSentence.text)} disabled={isSpeaking}>
                        <Volume2 className="h-4 w-4 mr-2" />Hear Correct Version
                      </Button>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle className="text-lg">Detailed Feedback</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {result.feedback.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className={item.type === "correct" ? "text-green-500" : "text-accent"}>{item.type === "correct" ? "✓" : "→"}</span>
                          <p className="text-sm">{item.text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  {result.ipa_tips?.length > 0 && (
                    <Card className="bg-secondary/50">
                      <CardHeader><CardTitle className="text-lg">🔤 Pronunciation Tips</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        {result.ipa_tips.map((tip, idx) => (
                          <div key={idx} className="border-l-4 border-primary pl-3 py-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{tip.word} <span className="text-muted-foreground font-mono text-sm">{tip.ipa}</span></p>
                              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => speak(tip.word, 0.7)} disabled={isSpeaking}>
                                <Volume2 className="h-3 w-3 mr-1" />Hear
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground">{tip.tip}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setSpokenText(""); setTypedText(""); }}>
                  <RotateCcw className="h-4 w-4 mr-2" />Try Again
                </Button>
                <Button className="flex-1" onClick={nextSentence}>
                  Next Sentence<ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Pronunciation;
