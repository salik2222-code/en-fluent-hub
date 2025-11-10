import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Grammar = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [corrections, setCorrections] = useState<any>(null);

  const handleCheck = () => {
    // Simulate grammar checking
    const mockCorrections = {
      original: text,
      corrected: text.replace(/dont/g, "don't").replace(/cant/g, "can't"),
      errors: [
        {
          mistake: "dont → don't",
          explanation: "Use apostrophe for contractions",
        },
        {
          mistake: "Subject-verb agreement",
          explanation: "Use 'doesn't' with third person singular",
        },
      ],
      tip: "Remember: contractions need apostrophes in English.",
    };
    setCorrections(mockCorrections);
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
            Get instant grammar corrections and explanations
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Paste Your Text</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type or paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] text-base"
            />
            <Button onClick={handleCheck} disabled={!text} size="lg" className="w-full">
              Check Grammar
            </Button>
          </CardContent>
        </Card>

        {corrections && (
          <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Corrected Version
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{corrections.corrected}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-accent" />
                  Errors & Fixes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {corrections.errors.map((error: any, idx: number) => (
                  <div key={idx} className="border-l-4 border-accent pl-4">
                    <p className="font-semibold text-accent">{error.mistake}</p>
                    <p className="text-sm text-muted-foreground">{error.explanation}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-secondary/50">
              <CardContent className="p-6">
                <p className="font-semibold mb-2">💡 Quick Tip:</p>
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
