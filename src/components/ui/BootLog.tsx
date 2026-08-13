"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_LOGS = [
  "runtime: browser_only",
  "modules_loaded: 69/69",
  "network_calls: 0",
  "data_uploaded: 0_bytes",
  "status: all_systems_nominal",
  "privacy: guaranteed",
];

export function BootLog({ className }: { className?: string }) {
  const [visibleLogs, setVisibleLogs] = useState<number>(0);

  useEffect(() => {
    if (visibleLogs < DEFAULT_LOGS.length) {
      const timer = setTimeout(() => {
        setVisibleLogs((prev) => prev + 1);
      }, 300 + Math.random() * 400);
      return () => clearTimeout(timer);
    }
  }, [visibleLogs]);

  return (
    <div className={cn("font-mono text-[0.7rem] sm:text-xs text-text-muted opacity-80 text-left", className)}>
      {DEFAULT_LOGS.map((log, index) => (
        <div
          key={index}
          className={cn(
            "overflow-hidden whitespace-nowrap transition-all duration-300",
            index < visibleLogs ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <span className="text-accent-secondary mr-2 opacity-80">&#9670;</span>
          {log}
        </div>
      ))}
    </div>
  );
}