import React from "react";
import { cn } from "@/lib/utils";

interface StatBlockProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export function StatBlock({ value, label, icon, className, ...props }: StatBlockProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-5 bg-bg-panel border border-border-line rounded-2xl",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-primary/10 text-accent-primary flex-shrink-0">
          {icon}
        </div>
      )}
      <div>
        <div className="text-2xl font-bold text-text-primary leading-none">{value}</div>
        <div className="text-xs text-text-muted mt-1.5 font-medium">{label}</div>
      </div>
    </div>
  );
}