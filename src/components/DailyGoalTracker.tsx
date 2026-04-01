import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import confetti from "canvas-confetti";

const GOAL_MINUTES = 30;
const STORAGE_KEY = "dailyGoal";

function getDailyData(): { date: string; seconds: number; celebrated: boolean } {
  const today = new Date().toDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (data.date === today) return data;
    }
  } catch {}
  return { date: today, seconds: 0, celebrated: false };
}

const DailyGoalTracker = () => {
  const [data, setData] = useState(getDailyData);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(getDailyData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.min(Math.floor(data.seconds / 60), GOAL_MINUTES);
  const pct = Math.min((minutes / GOAL_MINUTES) * 100, 100);
  const goalReached = minutes >= GOAL_MINUTES;

  useEffect(() => {
    if (goalReached && !data.celebrated) {
      setShowCelebration(true);
      const stored = getDailyData();
      stored.celebrated = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    }
  }, [goalReached, data.celebrated]);

  return (
    <>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Daily Goal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Practice {GOAL_MINUTES} minutes today</span>
              <span className="text-muted-foreground font-medium">{minutes}/{GOAL_MINUTES} min</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3">
              <div
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, hsl(186 80% 42%), hsl(174 70% 40%))",
                }}
              />
            </div>
            {goalReached && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" /> Goal achieved! Great work today! 🎉
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Time tracked on AI Tutor & Discussion pages
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCelebration} onOpenChange={setShowCelebration}>
        <DialogContent className="text-center max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl">🏆 Goal Achieved!</DialogTitle>
            <DialogDescription className="text-base mt-2">
              Congratulations! You've completed your {GOAL_MINUTES}-minute daily practice. Keep up the great work!
            </DialogDescription>
          </DialogHeader>
          <div className="text-6xl py-4">🎉</div>
          <Button onClick={() => setShowCelebration(false)} variant="hero" className="w-full">
            Continue Learning
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DailyGoalTracker;
