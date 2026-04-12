import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Mic, Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTTS, useSTT } from "@/hooks/useSpeech";

type Message = { role: "user" | "assistant"; content: string };
type ParsedMessage = { response: string; correction: { original: string; corrected: string; reason: string } | null; isPerfect: boolean };

function parseAIMessage(content: string): ParsedMessage {
  const responseMatch = content.match(/\[AI_RESPONSE\]\s*([\s\S]*?)(?=\[CORRECTION_START\]|$)/);
  const correctionMatch = content.match(/\[CORRECTION_START\]\s*([\s\S]*?)\s*\[CORRECTION_END\]/);
  const response = responseMatch ? responseMatch[1].trim() : content.replace(/\[AI_RESPONSE\]|\[CORRECTION_START\][\s\S]*?\[CORRECTION_END\]/g, "").trim();
  if (!correctionMatch) return { response, correction: null, isPerfect: false };
  const correctionText = correctionMatch[1].trim();
  if (correctionText.toLowerCase().includes("perfect") || correctionText.toLowerCase().includes("no changes needed")) return { response, correction: null, isPerfect: true };
  const originalMatch = correctionText.match(/Original:\s*"([^"]*)"/);
  const correctedMatch = correctionText.match(/Corrected:\s*"([^"]*)"/);
  const reasonMatch = correctionText.match(/Reason:\s*(.*)/);
  if (originalMatch && correctedMatch && reasonMatch) return { response, correction: { original: originalMatch[1], corrected: correctedMatch[1], reason: reasonMatch[1].trim() }, isPerfect: false };
  return { response, correction: null, isPerfect: false };
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

const CorrectionBlock = ({ parsed }: { parsed: ParsedMessage }) => {
  const [open, setOpen] = useState(false);
  if (parsed.isPerfect) return (
    <div className="mt-3 flex items-center gap-2 text-xs text-primary bg-primary/10 px-3 py-2 rounded-lg">
      <CheckCircle2 className="h-3.5 w-3.5" /><span className="font-medium">Perfect! No changes needed.</span>
    </div>
  );
  if (!parsed.correction) return null;
  return (
    <div className="mt-3">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-xs font-medium text-accent hover:text-accent/80 transition-colors">
        <AlertCircle className="h-3.5 w-3.5" />Grammar Correction {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 text-xs bg-accent/10 p-3 rounded-lg border border-accent/20">
          <p><span className="font-semibold text-destructive">Original:</span> "{parsed.correction.original}"</p>
          <p><span className="font-semibold text-primary">Corrected:</span> "{parsed.correction.corrected}"</p>
          <p><span className="font-semibold text-muted-foreground">Reason:</span> {parsed.correction.reason}</p>
        </div>
      )}
    </div>
  );
};

const Tutor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { speak, isSpeaking } = useTTS();
  const { startListening, isListening } = useSTT();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "[AI_RESPONSE] Hello! I'm your E-Speak AI Tutor. I'm here to help you learn English. What would you like to practice today?\n\n[CORRECTION_START] Perfect! No changes needed. [CORRECTION_END]" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

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
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })) }),
      });
      if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err.error || "Failed to get response"); }
      if (!resp.body) throw new Error("No response body");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });
        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);
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
      toast({ title: "Error", description: error instanceof Error ? error.message : "Failed to send message.", variant: "destructive" });
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}><ArrowLeft className="h-5 w-5" /></Button>
            <div><h1 className="text-xl font-bold">AI Tutor</h1><p className="text-sm text-muted-foreground">Your personal English teacher</p></div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="space-y-6">
            {messages.map((message, index) => {
              const parsed = message.role === "assistant" ? parseAIMessage(message.content) : null;
              return (
                <div key={index} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${message.role === "user" ? "bg-accent" : "bg-primary"}`}>
                    {message.role === "user" ? <User className="h-5 w-5 text-accent-foreground" /> : <Bot className="h-5 w-5 text-primary-foreground" />}
                  </div>
                  <Card className={`max-w-[80%] ${message.role === "user" ? "bg-accent/10" : "bg-primary/5"}`}>
                    <CardContent className="p-4">
                      {message.role === "assistant" && parsed ? (
                        <>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{parsed.response}</p>
                          <CorrectionBlock parsed={parsed} />
                          <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => speak(parsed.response)} disabled={isSpeaking}>
                            <Volume2 className="h-3.5 w-3.5 mr-1" />{isSpeaking ? "Playing..." : "Listen"}
                          </Button>
                        </>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            })}
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
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type or use the mic... (Enter to send)" className="min-h-[60px] resize-none" disabled={isLoading} />
            <Button variant="hero" size="icon" onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="h-[60px] w-[60px] shrink-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">E-Speak AI Tutor keeps conversations focused on English learning only</p>
        </div>
      </div>
    </div>
  );
};

export default Tutor;
