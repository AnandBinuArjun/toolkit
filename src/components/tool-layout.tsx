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

export function ToolLayout({ id, name, description, children }: ToolLayoutProps) {
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
      <nav className="flex items-center text-sm font-medium text-text-muted">
        <Link
          href="/"
          className="hover:text-text-primary transition-colors flex items-center gap-1 group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          All Tools
        </Link>
        <span className="mx-2 opacity-50">/</span>
        <span className="text-text-primary">{name}</span>
      </nav>

      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">{name}</h1>
        <p className="text-text-muted text-base leading-relaxed max-w-2xl">{description}</p>
      </div>

      <div className="flex-1 bg-bg-panel border border-border-line rounded-2xl p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}