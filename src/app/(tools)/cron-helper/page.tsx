"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { format } from "date-fns";
import cronstrue from "cronstrue";
import cronParser from "cron-parser";
import { Input } from "@/components/ui/input";


export default function CronHelperPage() {
  const tool = TOOLS.find((t) => t.id === "cron-helper")!;
  const [expression, setExpression] = useState("0 * * * *");
  const [description, setDescription] = useState("");
  const [nextRuns, setNextRuns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const calculateCron = (expr: string) => {
    if (!expr.trim()) {
      setDescription("");
      setNextRuns([]);
      setError(null);
      return;
    }

    try {
      // 1. Get human readable description
      const desc = cronstrue.toString(expr, { throwExceptionOnParseError: true });
      setDescription(desc);

      // 2. Get next 5 occurrences
      const interval = cronParser.parse(expr);
      const runs = [];
      for (let i = 0; i < 5; i++) {
        runs.push(format(interval.next().toDate(), "yyyy-MM-dd HH:mm:ss"));
      }
      setNextRuns(runs);
      setError(null);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid cron expression");
      }
      setDescription("");
      setNextRuns([]);
    }
  };

  useEffect(() => {
    calculateCron(expression);
  }, [expression]);

  const commonCrons = [
    { label: "Every minute", expr: "* * * * *" },
    { label: "Every 5 minutes", expr: "*/5 * * * *" },
    { label: "Every hour", expr: "0 * * * *" },
    { label: "Every day at midnight", expr: "0 0 * * *" },
    { label: "Every Monday", expr: "0 0 * * 1" },
    { label: "First day of month", expr: "0 0 1 * *" },
  ];

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Input Area */}
        <div className="flex flex-col items-center pt-8">
          <label className="text-xs font-sans font-medium text-text-muted mb-4 uppercase tracking-wider">Cron Expression</label>
          <div className="relative w-full max-w-2xl">
            <Input
              type="text"
              className="w-full bg-bg-panel border-2 border-border-line rounded-xl px-6 py-6 text-3xl sm:text-5xl font-mono text-text-primary text-center focus:outline-none focus:border-accent-primary transition-colors"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="* * * * *"
              spellCheck={false}
            />
            {error && (
              <div className="absolute -bottom-8 left-0 right-0 text-center text-accent-danger font-mono text-sm">
                {error}
              </div>
            )}
          </div>
          
          <div className={`mt-12 text-2xl font-bold text-center h-8 transition-colors ${error ? "text-accent-danger" : "text-accent-secondary"}`}>
            {description ? `"${description}"` : ""}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto mt-8">
          {/* Next Runs */}
          <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden h-fit">
            <div className="p-3 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-text-muted">Next 5 Occurrences</span>
            </div>
            <div className="p-4 flex flex-col gap-2">
              {nextRuns.length > 0 ? (
                nextRuns.map((run, i) => (
                  <div key={i} className="flex items-center gap-4 text-sm font-mono text-text-primary p-2 bg-bg-panel rounded border border-border-line">
                    <span className="text-text-muted opacity-50 w-4">{i + 1}.</span>
                    <span>{run}</span>
                  </div>
                ))
              ) : (
                <div className="text-text-muted text-sm font-mono text-center py-4">
                  Waiting for valid expression...
                </div>
              )}
            </div>
          </div>

          {/* Quick Presets */}
          <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden h-fit">
            <div className="p-3 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-text-muted">Common Schedules</span>
            </div>
            <div className="p-2 grid grid-cols-1 gap-2">
              {commonCrons.map((preset, i) => (
                <button
                  key={i}
                  onClick={() => setExpression(preset.expr)}
                  className="flex items-center justify-between p-2 rounded hover:bg-bg-panel border border-transparent hover:border-border-line transition-all text-left"
                >
                  <span className="text-sm text-text-primary">{preset.label}</span>
                  <span className="text-xs font-sans font-medium text-accent-primary bg-accent-primary/10 px-2 py-1 rounded">
                    {preset.expr}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Helper Syntax */}
        <div className="w-full max-w-4xl mx-auto border-t border-border-line pt-8">
          <div className="flex gap-4 font-mono text-xs text-text-muted justify-center text-center">
             <div><strong className="text-text-primary block">*</strong> any value</div>
             <div><strong className="text-text-primary block">,</strong> value list separator</div>
             <div><strong className="text-text-primary block">-</strong> range of values</div>
             <div><strong className="text-text-primary block">/</strong> step values</div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}