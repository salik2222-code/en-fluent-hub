import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import StudentLogin from "./pages/StudentLogin";
import TeacherLogin from "./pages/TeacherLogin";
import TeacherLiveLogs from "./pages/teacher/TeacherLiveLogs";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import Tutor from "./pages/Tutor";
import Pronunciation from "./pages/Pronunciation";
import Grammar from "./pages/Grammar";
import Lessons from "./pages/Lessons";
import Discussion from "./pages/Discussion";
import TalkWithESpeak from "./pages/TalkWithESpeak";
import Roadmap from "./pages/Roadmap";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherAnalytics from "./pages/teacher/TeacherAnalytics";
import TeacherSettings from "./pages/teacher/TeacherSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<StudentLogin />} />
            <Route path="/teacher-login" element={<TeacherLogin />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tutor" element={<Tutor />} />
            <Route path="/pronunciation" element={<Pronunciation />} />
            <Route path="/grammar" element={<Grammar />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/discussion" element={<Discussion />} />
            <Route path="/talk" element={<TalkWithESpeak />} />
            <Route path="/roadmap" element={<Roadmap />} />

            {/* Teacher Portal — role-gated */}
            <Route path="/teacher" element={<ProtectedRoute requireRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
            <Route path="/teacher/students" element={<ProtectedRoute requireRole="teacher"><TeacherStudents /></ProtectedRoute>} />
            <Route path="/teacher/assignments" element={<ProtectedRoute requireRole="teacher"><TeacherAssignments /></ProtectedRoute>} />
            <Route path="/teacher/analytics" element={<ProtectedRoute requireRole="teacher"><TeacherAnalytics /></ProtectedRoute>} />
            <Route path="/teacher/live-logs" element={<ProtectedRoute requireRole="teacher"><TeacherLiveLogs /></ProtectedRoute>} />
            <Route path="/teacher/settings" element={<ProtectedRoute requireRole="teacher"><TeacherSettings /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
