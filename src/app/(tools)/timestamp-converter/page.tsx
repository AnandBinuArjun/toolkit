"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Clock } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";


export default function TimestampConverterPage() {
  const tool = TOOLS.find((t) => t.id === "timestamp-converter")!;
  
  const [input, setInput] = useState<string>("");
  const [dateObj, setDateObj] = useState<Date | null>(null);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  
  // Update live clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set initial input to current epoch
  useEffect(() => {
    if (!input) {
      const nowEpoch = Math.floor(Date.now() / 1000).toString();
      setInput(nowEpoch);
      setDateObj(new Date(Number(nowEpoch) * 1000));
    }
  }, []);

  // Parse input when it changes
  useEffect(() => {
    if (!input) {
      setDateObj(null);
      return;
    }
    
    let parsed: Date | null = null;
    
    // Try to parse as epoch (seconds or milliseconds)
    if (/^\d+$/.test(input)) {
      const num = Number(input);
      // If it's a 10-digit number or less, assume seconds
      if (input.length <= 11) {
        parsed = new Date(num * 1000);
      } else {
        // Assume milliseconds
        parsed = new Date(num);
      }
    } else {
      // Try string parsing
      const d = new Date(input);
      if (!isNaN(d.getTime())) {
        parsed = d;
      }
    }
    
    if (parsed && !isNaN(parsed.getTime())) {
      setDateObj(parsed);
    } else {
      setDateObj(null);
    }
  }, [input]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const ResultRow = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div className="flex items-center justify-between p-3 border-b border-border-line last:border-0 hover:bg-bg-base transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 w-full">
        <span className="text-xs font-sans font-medium text-text-muted w-32 shrink-0">{label}</span>
        <span className="text-sm font-mono text-text-primary break-all">{value}</span>
      </div>
      <button 
        onClick={() => copyToClipboard(value, id)}
        className="ml-4 p-1.5 rounded hover:bg-bg-panel text-text-muted hover:text-accent-secondary transition-colors shrink-0"
        title="Copy"
      >
        {copiedMap[id] ? <Check size={14} className="text-accent-secondary" /> : <Copy size={14} />}
      </button>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        
        {/* Live Clock Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border-line rounded-lg bg-bg-base gap-4">
          <div className="flex items-center gap-3">
            <Clock className="text-accent-primary animate-pulse" />
            <div>
              <div className="text-sm font-mono text-text-primary">Current Time</div>
              <div className="text-xs text-text-muted">Local system time</div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-lg font-sans font-semibold text-accent-primary">
              {Math.floor(currentTime.getTime() / 1000)}
            </div>
            <div className="text-xs font-sans font-medium text-text-muted">
              {format(currentTime, "yyyy-MM-dd HH:mm:ss zzz")}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-sans font-medium text-text-muted">Enter Epoch or Date String</label>
            <div className="flex gap-2">
              <Input
                type="text"
                className="flex-1 bg-bg-panel border border-border-line rounded-lg px-4 py-3 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors"
                placeholder="e.g., 1700000000 or 2024-01-01"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                onClick={() => setInput(Math.floor(Date.now() / 1000).toString())}
                className="px-4 py-2 bg-bg-panel border border-border-line rounded-lg text-sm font-sans font-medium text-text-muted hover:text-accent-primary hover:border-accent-primary transition-colors whitespace-nowrap"
              >
                Set to Now
              </button>
            </div>
          </div>

          <div className="mt-4 border border-border-line rounded-lg bg-bg-panel overflow-hidden">
            <div className="p-3 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-accent-primary">Parsed Results</span>
            </div>
            
            {dateObj ? (
              <div className="flex flex-col">
                <ResultRow label="Epoch (seconds)" value={Math.floor(dateObj.getTime() / 1000).toString()} id="sec" />
                <ResultRow label="Epoch (ms)" value={dateObj.getTime().toString()} id="ms" />
                <ResultRow label="ISO 8601" value={dateObj.toISOString()} id="iso" />
                <ResultRow label="Local Date" value={format(dateObj, "yyyy-MM-dd")} id="local-date" />
                <ResultRow label="Local Time" value={format(dateObj, "HH:mm:ss")} id="local-time" />
                <ResultRow label="Local Full" value={format(dateObj, "yyyy-MM-dd HH:mm:ss OOOO")} id="local-full" />
                <ResultRow label="UTC Full" value={dateObj.toUTCString()} id="utc-full" />
              </div>
            ) : (
              <div className="p-8 text-center text-accent-danger font-mono text-sm">
                Invalid or unparseable date/timestamp
              </div>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}