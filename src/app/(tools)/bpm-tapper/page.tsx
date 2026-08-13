"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { RotateCcw, Activity } from "lucide-react";


export default function BpmTapperPage() {
  const tool = TOOLS.find((t) => t.id === "bpm-tapper")!;
  
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number>(0);
  const [isTapping, setIsTapping] = useState(false);
  const [lastTapTime, setLastTapTime] = useState<number | null>(null);
  
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTap = () => {
    const now = Date.now();
    
    // Reset if it's been more than 3 seconds since last tap
    if (lastTapTime && now - lastTapTime > 3000) {
      setTaps([now]);
      setBpm(0);
      setIsTapping(true);
      setLastTapTime(now);
      return;
    }

    const newTaps = [...taps, now];
    // Keep only the last 10 taps to keep it responsive to tempo changes
    if (newTaps.length > 10) {
      newTaps.shift();
    }
    
    setTaps(newTaps);
    setLastTapTime(now);
    setIsTapping(true);

    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      
      const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / averageInterval);
      setBpm(calculatedBpm);
    }

    // Auto reset after 3 seconds of inactivity
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
    
    resetTimeoutRef.current = setTimeout(() => {
      setIsTapping(false);
    }, 3000);
  };

  const handleReset = () => {
    setTaps([]);
    setBpm(0);
    setIsTapping(false);
    setLastTapTime(null);
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
    }
  };

  // Allow spacebar tapping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        handleTap();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [taps, lastTapTime]);

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col items-center max-w-2xl mx-auto w-full space-y-12 py-8">
        
        {/* BPM Display */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative flex items-center justify-center">
            <span className={`text-9xl font-bold font-mono tracking-tighter transition-all duration-100 ${isTapping ? 'text-accent-primary drop-shadow-[0_0_20px_rgba(0,102,204,0.8)] scale-105' : 'text-text-primary'}`}>
              {bpm > 0 ? bpm : "---"}
            </span>
            {isTapping && (
              <Activity 
                size={120} 
                className="absolute text-accent-primary/10 animate-ping pointer-events-none" 
              />
            )}
          </div>
          <span className="text-xl font-sans font-medium text-text-muted uppercase tracking-widest">
            Beats Per Minute
          </span>
        </div>

        {/* Tap Area */}
        <button
          onPointerDown={(e) => {
             e.preventDefault();
             handleTap();
          }}
          className={`w-full max-w-md aspect-square rounded-full flex flex-col items-center justify-center border-4 transition-all duration-75 select-none ${isTapping ? 'bg-accent-primary/20 border-accent-primary scale-95' : 'bg-bg-panel border-border-line hover:border-text-muted hover:bg-black/60'}`}
          style={{ touchAction: 'manipulation' }}
        >
          <span className="text-3xl font-bold font-mono text-text-primary mb-2">TAP HERE</span>
          <span className="text-sm font-sans font-medium text-text-muted">or press SPACE</span>
        </button>

        <div className="flex flex-col items-center space-y-6">
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-bg-panel border border-border-line rounded-full text-text-muted hover:text-accent-danger hover:border-accent-danger transition-colors font-mono text-sm"
          >
            <RotateCcw size={16} /> Reset Counter
          </button>
          
          <p className="text-xs font-sans font-medium text-text-muted text-center max-w-sm">
            Keep tapping to the beat of the song. The counter averages your last 10 taps for a precise BPM reading. Auto-resets after 3 seconds of inactivity.
          </p>
        </div>

      </div>
    </ToolLayout>
  );
}