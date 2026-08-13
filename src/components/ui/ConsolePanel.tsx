import React from "react";
import { cn } from "@/lib/utils";

interface ConsolePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function ConsolePanel({ title, icon, children, className, ...props }: ConsolePanelProps) {
  // Strip .sys from legacy titles
  const cleanTitle = title?.replace(/\.sys$/i, '');

  return (
    <div
      className={cn(
        "flex flex-col bg-bg-panel border border-border-line rounded-2xl overflow-hidden",
        className
      )}
      {...props}
    >
      {cleanTitle && (
        <div className="flex items-center gap-2 px-6 pt-6 pb-2">
          {icon && <span className="text-accent-primary">{icon}</span>}
          <span className="text-base font-semibold text-text-primary">{cleanTitle}</span>
        </div>
      )}
      <div className={cn("px-6 pb-6 flex-1", cleanTitle ? "pt-2" : "pt-6")}>
        {children}
      </div>
    </div>
  );
}