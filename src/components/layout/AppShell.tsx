import type { ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { AuthProvider, useAuth } from "@/lib/auth";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path === "/login") return <>{children}</>;
  if (!user) return <Navigate to="/login" />;
  return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar />
        <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
        </div>
      </div>
  );
}