import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Bot, User, MessageSquare, Swords, Mic, Volume2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { discussionTopics } from "@/data/discussionTopics";
import { useTTS, useSTT } from "@/hooks/useSpeech";

type Message = { role: "user" | "assistant"; content: string };
const DISCUSSION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discussion`;

const Discussion = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, isSpeaking } = useTTS();
  const { startListening, isListening } = useSTT();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [mode, setMode] = useState<"discuss" | "debate">("discuss");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const startTopic = (topic: string, chosenMode: "discuss" | "debate") => {
    setSelectedTopic(topic);
    setMode(chosenMode);
    const intro: Message = {
      role: "assistant",
      content: chosenMode === "debate"
        ? `Welcome to the debate! 🎯 Our topic: "${topic}". I'll take the opposite position. You go first!`
        : `Let's discuss "${topic}"! 💬 What comes to mind first?`,
    };
    setMessages([intro]);
  };

  const handleSend = async (text?: string) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    const userMessage: Message = { role: "user", content: msg };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    let assistantContent = "";
    try {
      const resp = await fetch(DISCUSSION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })), topic: selectedTopic, mode }),
      });
      if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err.error || "Failed"); }
      if (!resp.body) throw new Error("No body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let ni: number;
        while ((ni = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, ni);
          textBuffer = textBuffer.slice(ni + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              const cur = assistantContent;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > 1 && prev[prev.length - 2]?.role === "user") return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: cur } : m));
                return [...prev, { role: "assistant", content: cur }];
              });
            }
          } catch { textBuffer = line + "\n" + textBuffer; break; }
        }
      }
    } catch (error) {
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const handleMic = () => {
    if (isListening) return;
    startListening(
      (text) => { setInput(text); handleSend(text); },
      (err) => toast({ title: "Mic Error", description: err, variant: "destructive" })
    );
  };

  if (!selectedTopic) {
    const levels = ["Beginner", "Intermediate", "Advanced"] as const;
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={() => navigate("/dashboard")}><ArrowLeft className="h-5 w-5 mr-2" />Back to Dashboard</Button>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Discussion & Debate</h1>
            <p className="text-muted-foreground text-lg">30 topics across 3 levels — with voice support</p>
          </div>
          <Tabs defaultValue="Beginner">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-6">
              {levels.map((l) => <TabsTrigger key={l} value={l}>{l}</TabsTrigger>)}
            </TabsList>
            {levels.map((level) => (
              <TabsContent key={level} value={level}>
                <div className="grid gap-4 md:grid-cols-2">
                  {discussionTopics.filter((t) => t.difficulty === level).map((topic, idx) => (
                    <Card key={idx} className="group hover:shadow-xl transition-all hover:scale-[1.02]">
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{topic.difficulty}</Badge>
                          <span className="text-2xl">{topic.emoji}</span>
                        </div>
                        <CardTitle className="text-xl">{topic.title}</CardTitle>
                        <CardDescription>Choose your mode</CardDescription>
                      </CardHeader>
                      <CardContent className="flex gap-2">
                        <Button className="flex-1" variant="outline" onClick={() => startTopic(topic.title, "discuss")}><MessageSquare className="h-4 w-4 mr-2" />Discuss</Button>
                        <Button className="flex-1" onClick={() => startTopic(topic.title, "debate")}><Swords className="h-4 w-4 mr-2" />Debate</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => { setSelectedTopic(null); setMessages([]); }}><ArrowLeft className="h-5 w-5" /></Button>
            <div className="flex-1"><h1 className="text-xl font-bold">{mode === "debate" ? "⚔️" : "💬"} {selectedTopic}</h1><p className="text-sm text-muted-foreground capitalize">{mode} Mode</p></div>
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-accent" : "bg-primary"}`}>
                  {message.role === "user" ? <User className="h-5 w-5 text-accent-foreground" /> : <Bot className="h-5 w-5 text-primary-foreground" />}
                </div>
                <Card className={`max-w-[80%] ${message.role === "user" ? "bg-accent/10" : "bg-primary/5"}`}>
                  <CardContent className="p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    {message.role === "assistant" && (
                      <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => speak(message.content)} disabled={isSpeaking}>
                        <Volume2 className="h-3.5 w-3.5 mr-1" />{isSpeaking ? "Playing..." : "Listen"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
            {isLoading && !messages[messages.length - 1]?.content && (
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center"><Bot className="h-5 w-5 text-primary-foreground" /></div>
                <Card className="bg-primary/5"><CardContent className="p-4"><div className="flex gap-2"><div className="w-2 h-2 rounded-full bg-primary animate-bounce" /><div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }} /><div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.4s" }} /></div></CardContent></Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      <div className="border-t bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex gap-3">
            <Button variant={isListening ? "destructive" : "outline"} size="icon" onClick={handleMic} className="h-[60px] w-[60px] shrink-0">
              <Mic className={`h-5 w-5 ${isListening ? "animate-pulse" : ""}`} />
            </Button>
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type or speak..." className="min-h-[60px] resize-none" disabled={isLoading} />
            <Button size="icon" onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="h-[60px] w-[60px] shrink-0"><Send className="h-5 w-5" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Discussion;
