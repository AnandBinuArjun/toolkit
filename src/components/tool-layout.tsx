import React, { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ToolLayoutProps {
  id: string;
  name: string;
  description: string;
  status?: "READY" | "PROCESSING";
  children: React.ReactNode;
}

export function ToolLayout({ id, name, description, status, children }: ToolLayoutProps) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("toolkit-recent");
      const recents = stored ? JSON.parse(stored) : [];
      const newRecents = [id, ...recents.filter((rid: string) => rid !== id)].slice(0, 5);
      localStorage.setItem("toolkit-recent", JSON.stringify(newRecents));
    } catch (err) {
      console.error("Could not save to recent tools", err);
    }
  }, [id]);

  return (
    <div className="flex flex-col min-h-full space-y-6 max-w-5xl mx-auto w-full">
      <nav className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2 text-sm font-medium text-text-muted">
        <div className="flex items-center min-h-[44px]">
          <Link
            href="/"
            className="hover:text-text-primary transition-colors flex items-center gap-1 group py-2"
            aria-label="Back to Registry"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">All Tools</span>
          </Link>
          <span className="mx-2 opacity-50">/</span>
          <span className="text-text-primary truncate max-w-[200px] sm:max-w-none">{name}</span>
        </div>
        {status && (
          <div className={`self-start sm:self-auto text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full border ${
            status === "READY" 
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
              : "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse"
          }`}>
            {status}
          </div>
        )}
      </nav>

      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">{name}</h1>
        <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-prose">{description}</p>
      </div>

      <div className="flex-1 bg-bg-panel border border-border-line rounded-2xl p-4 sm:p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}