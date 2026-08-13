"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Keyboard } from "lucide-react";


export default function KeycodeInspectorPage() {
  const tool = TOOLS.find((t) => t.id === "keycode-inspector")!;
  
  const [lastEvent, setLastEvent] = useState<KeyboardEvent | null>(null);
  const [history, setHistory] = useState<KeyboardEvent[]>([]);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [isCapturing, setIsCapturing] = useState(true);

  useEffect(() => {
    if (!isCapturing) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for many shortcuts to allow capturing
      // but allow basic ones like refresh (F5) or devtools (F12)
      if (
        e.key !== "F5" && 
        e.key !== "F12" && 
        !(e.metaKey && e.key === "r")
      ) {
        e.preventDefault();
      }
      
      setLastEvent(e);
      setHistory(prev => [e, ...prev].slice(0, 10)); // Keep last 10
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCapturing]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const PropertyBox = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div className="bg-bg-panel border border-border-line rounded-lg p-4 flex flex-col items-center justify-center relative group">
      <span className="text-xs font-sans font-medium text-text-muted mb-2">{label}</span>
      <span className="text-xl font-mono text-text-primary text-center break-all">{value}</span>
      
      <button 
        onClick={() => copyToClipboard(value, id)}
        className="absolute top-2 right-2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-bg-panel text-text-muted hover:text-accent-secondary transition-all"
        title="Copy"
      >
        {copiedMap[id] ? <Check size={14} className="text-accent-secondary" /> : <Copy size={14} />}
      </button>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        
        {/* Main Capture Area */}
        <div 
          className={`flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-xl transition-colors ${
            isCapturing 
              ? lastEvent ? "border-accent-primary bg-accent-primary/5" : "border-border-line bg-bg-base"
              : "border-border-line/50 bg-black/10 opacity-50"
          }`}
        >
          {isCapturing ? (
            lastEvent ? (
              <div className="flex flex-col items-center">
                <span className="text-6xl font-sans font-semibold text-accent-primary mb-2">
                  {lastEvent.which}
                </span>
                <span className="text-sm font-sans font-medium text-text-muted">
                  e.which / e.keyCode
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-text-muted animate-pulse">
                <Keyboard size={48} className="mb-4" />
                <span className="font-mono text-sm">Press any key to capture...</span>
              </div>
            )
          ) : (
            <div className="font-mono text-sm text-text-muted">Capture Paused</div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsCapturing(!isCapturing)}
            className={`px-4 py-2 rounded-md font-mono text-sm border transition-colors ${
              isCapturing 
                ? "bg-bg-panel border-border-line text-text-primary hover:border-accent-danger hover:text-accent-danger" 
                : "bg-accent-primary/20 border-accent-primary text-accent-primary"
            }`}
          >
            {isCapturing ? "Pause Capture" : "Resume Capture"}
          </button>
        </div>

        {/* Detailed Properties */}
        {lastEvent && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <PropertyBox label="event.key" value={lastEvent.key === " " ? "(Space character)" : lastEvent.key} id="key" />
            <PropertyBox label="event.code" value={lastEvent.code} id="code" />
            <PropertyBox label="event.which" value={lastEvent.which.toString()} id="which" />
            <PropertyBox 
              label="Modifiers" 
              value={[
                lastEvent.ctrlKey && "Ctrl",
                lastEvent.altKey && "Alt",
                lastEvent.shiftKey && "Shift",
                lastEvent.metaKey && "Meta"
              ].filter(Boolean).join(" + ") || "None"} 
              id="mods" 
            />
          </div>
        )}

        {/* History */}
        {history.length > 0 && (
          <div className="mt-8 border border-border-line rounded-lg overflow-hidden bg-bg-panel">
            <div className="p-3 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-text-muted">Recent Keys (Last 10)</span>
            </div>
            <div className="flex flex-wrap gap-2 p-4">
              {history.map((e, i) => (
                <div key={i} className="px-3 py-1 bg-bg-panel border border-border-line rounded text-sm font-mono text-text-primary">
                  {e.key === " " ? "Space" : e.key}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}