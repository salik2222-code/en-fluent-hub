import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

export const ProtectedRoute = ({
  children,
  requireRole,
}: {
  children: ReactNode;
  requireRole?: "teacher" | "student";
}) => {
  const { user, role, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (requireRole && role !== requireRole) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
