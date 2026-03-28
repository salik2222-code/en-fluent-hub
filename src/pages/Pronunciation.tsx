import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Square, Play, ArrowLeft, Volume2, Loader2, RotateCcw, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/tts`;
const PRONUNCIATION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pronunciation-check`;

const sentences = [
  { text: "The weather is beautiful today.", level: "Beginner" },
  { text: "I would like to order a coffee, please.", level: "Beginner" },
  { text: "She sells seashells by the seashore.", level: "Intermediate" },
  { text: "The technology industry continues to evolve rapidly.", level: "Intermediate" },
  { text: "How do you pronounce this word correctly?", level: "Beginner" },
  { text: "Although it was raining, they decided to go for a walk.", level: "Advanced" },
  { text: "The restaurant's atmosphere was absolutely magnificent.", level: "Advanced" },
  { text: "Practice makes perfect, so keep trying every day.", level: "Beginner" },
];

type FeedbackItem = { type: "correct" | "improvement"; text: string };
type IpaTip = { word: string; ipa: string; tip: string };
type PronunciationResult = {
  score: number;
  feedback: FeedbackItem[];
  ipa_tips: IpaTip[];
  overall: string;
};

const Pronunciation = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSentence = sentences[currentIndex];

  const handleListen = async () => {
    setIsPlaying(true);
    try {
      const resp = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text: currentSentence.text, speed: playbackSpeed }),
      });

      if (!resp.ok) throw new Error("TTS failed");
      const data = await resp.json();

      if (data.audioContent) {
        const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        await audio.play();
      }
    } catch (error) {
      toast({ title: "Error", description: "Could not play audio. Please try again.", variant: "destructive" });
      setIsPlaying(false);
    }
  };

  const handleRecord = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: "Not Supported", description: "Speech recognition is not supported in this browser. Try Chrome.", variant: "destructive" });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setIsRecording(false);
      await analyzePronounciation(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsRecording(false);
      if (event.error === "not-allowed") {
        toast({ title: "Microphone Access", description: "Please allow microphone access to record.", variant: "destructive" });
      } else {
        toast({ title: "Error", description: "Could not recognize speech. Please try again.", variant: "destructive" });
      }
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
    setResult(null);
    setSpokenText("");
    toast({ title: "🎤 Recording", description: "Speak the sentence clearly..." });
  }, [isRecording, currentSentence.text]);

  const analyzePronounciation = async (spoken: string) => {
    setIsAnalyzing(true);
    try {
      const resp = await fetch(PRONUNCIATION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ expected: currentSentence.text, spoken }),
      });

      if (!resp.ok) throw new Error("Analysis failed");
      const data: PronunciationResult = await resp.json();
      setResult(data);
    } catch (error) {
      toast({ title: "Error", description: "Could not analyze pronunciation.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextSentence = () => {
    setCurrentIndex((prev) => (prev + 1) % sentences.length);
    setResult(null);
    setSpokenText("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
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
            Listen to native audio, record yourself, and get AI feedback
          </p>
        </div>

        {/* Sentence Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sentence {currentIndex + 1} of {sentences.length}</CardTitle>
            <Badge variant="outline">{currentSentence.level}</Badge>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary/30 p-6 rounded-lg mb-6">
              <p className="text-2xl font-medium text-center mb-6">{currentSentence.text}</p>

              {/* Speed control */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground">Speed:</span>
                {[0.7, 1.0, 1.2].map((speed) => (
                  <Button
                    key={speed}
                    variant={playbackSpeed === speed ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlaybackSpeed(speed)}
                    className="text-xs px-3"
                  >
                    {speed === 0.7 ? "Slow" : speed === 1.0 ? "Normal" : "Fast"}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                size="lg"
                onClick={handleListen}
                disabled={isPlaying}
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="h-5 w-5 mr-2 animate-pulse" />
                    Playing...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Listen to Native Speaker
                  </>
                )}
              </Button>
            </div>

            {/* Record Button */}
            <div className="space-y-4">
              <Button
                size="lg"
                variant={isRecording ? "destructive" : "default"}
                onClick={handleRecord}
                disabled={isAnalyzing}
                className="w-full h-20 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                    Analyzing your pronunciation...
                  </>
                ) : isRecording ? (
                  <>
                    <Square className="h-6 w-6 mr-3" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-6 w-6 mr-3" />
                    {result ? "Record Again" : "Start Recording"}
                  </>
                )}
              </Button>

              {spokenText && (
                <Card className="bg-secondary/20">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">What we heard:</p>
                    <p className="text-lg">{spokenText}</p>
                  </CardContent>
                </Card>
              )}

              {/* Results */}
              {result && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Score */}
                  <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Pronunciation Score</p>
                        <p className={`text-5xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}
                        </p>
                        <p className="text-2xl text-muted-foreground">/100</p>
                      </div>
                      <Progress value={result.score} className="h-3 mb-4" />
                      <p className="text-center text-muted-foreground">{result.overall}</p>
                    </CardContent>
                  </Card>

                  {/* Feedback */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Detailed Feedback</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {result.feedback.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className={item.type === "correct" ? "text-green-500" : "text-accent"}>
                            {item.type === "correct" ? "✓" : "→"}
                          </span>
                          <p className="text-sm">{item.text}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* IPA Tips */}
                  {result.ipa_tips && result.ipa_tips.length > 0 && (
                    <Card className="bg-secondary/50">
                      <CardHeader>
                        <CardTitle className="text-lg">🔤 Pronunciation Tips</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {result.ipa_tips.map((tip, idx) => (
                          <div key={idx} className="border-l-4 border-primary pl-3 py-1">
                            <p className="font-semibold">
                              {tip.word} <span className="text-muted-foreground font-mono text-sm">{tip.ipa}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">{tip.tip}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => { setResult(null); setSpokenText(""); }}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button className="flex-1" onClick={nextSentence}>
                  Next Sentence
                  <ChevronRight className="h-4 w-4 ml-2" />
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
