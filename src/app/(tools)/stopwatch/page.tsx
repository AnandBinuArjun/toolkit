"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Play, Pause, Square, Flag, Trash2 } from "lucide-react";


export default function StopwatchPage() {
  const tool = TOOLS.find((t) => t.id === "stopwatch")!;
  
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in milliseconds
  const [laps, setLaps] = useState<{ id: number; time: number; delta: number }[]>([]);
  
  const startTimeRef = useRef<number>(0);
  const requestRef = useRef<number | null>(null);

  const updateTimer = () => {
    if (!startTimeRef.current) return;
    const now = performance.now();
    setTime(now - startTimeRef.current);
    requestRef.current = requestAnimationFrame(updateTimer);
  };

  const handleStart = () => {
    if (!isRunning) {
      setIsRunning(true);
      startTimeRef.current = performance.now() - time;
      requestRef.current = requestAnimationFrame(updateTimer);
    }
  };

  const handlePause = () => {
    if (isRunning) {
      setIsRunning(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setTime(0);
    setLaps([]);
    startTimeRef.current = 0;
  };

  const handleLap = () => {
    if (isRunning) {
      const delta = laps.length > 0 ? time - laps[0].time : time;
      setLaps([{ id: laps.length + 1, time, delta }, ...laps]);
    }
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const formatTime = (ms: number) => {
    const totalMs = Math.floor(ms);
    const m = Math.floor(totalMs / 60000);
    const s = Math.floor((totalMs % 60000) / 1000);
    const ms10 = Math.floor((totalMs % 1000) / 10);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${ms10.toString().padStart(2, "0")}`;
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col max-w-2xl mx-auto w-full space-y-8">
        
        {/* Main Display */}
        <div className="flex flex-col items-center justify-center p-12 bg-bg-panel border border-border-line rounded-3xl relative overflow-hidden group">
          {/* Subtle animated background when running */}
          {isRunning && (
            <div className="absolute inset-0 bg-accent-primary/5 animate-pulse" />
          )}
          
          <span className="text-[5rem] sm:text-[7rem] font-bold font-mono text-text-primary tracking-tighter tabular-nums leading-none relative z-10 drop-shadow-xl">
            {formatTime(time)}
          </span>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={isRunning ? handleLap : handleReset}
            className={`flex flex-col items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm border transition-all ${
              isRunning 
                ? "bg-bg-panel border-border-line text-text-primary hover:border-text-primary" 
                : "bg-bg-panel border-border-line text-text-muted hover:text-accent-danger hover:border-accent-danger"
            }`}
          >
            {isRunning ? (
              <><Flag size={20} /> Lap</>
            ) : (
              <><Square size={20} /> Reset</>
            )}
          </button>

          <button
            onClick={isRunning ? handlePause : handleStart}
            className={`col-span-2 flex items-center justify-center gap-2 py-4 rounded-xl font-sans font-semibold text-lg border transition-all ${
              isRunning 
                ? "bg-yellow-500/20 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black" 
                : "bg-accent-primary/20 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-black"
            }`}
          >
            {isRunning ? (
              <><Pause size={24} /> Pause</>
            ) : (
              <><Play size={24} /> {time > 0 ? "Resume" : "Start"}</>
            )}
          </button>
        </div>

        {/* Laps List */}
        {laps.length > 0 && (
          <div className="flex flex-col border border-border-line rounded-xl bg-bg-base overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-border-line bg-bg-panel">
              <span className="text-xs font-bold font-sans font-medium text-text-muted uppercase tracking-wider">Laps ({laps.length})</span>
              <button 
                onClick={() => setLaps([])}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors font-mono"
              >
                <Trash2 size={14} /> Clear Laps
              </button>
            </div>
            
            <div className="flex flex-col max-h-[400px] overflow-y-auto">
              {laps.map((lap, index) => (
                <div 
                  key={lap.id} 
                  className={`flex justify-between items-center p-4 font-mono text-sm border-b border-border-line/30 last:border-0 ${index === 0 ? 'bg-accent-primary/5 text-accent-primary' : 'text-text-primary hover:bg-bg-panel transition-colors'}`}
                >
                  <span className="text-text-muted w-16">#{lap.id.toString().padStart(2, "0")}</span>
                  <span className={index === 0 ? 'font-bold' : ''}>+{formatTime(lap.delta)}</span>
                  <span className={index === 0 ? 'font-bold' : ''}>{formatTime(lap.time)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}