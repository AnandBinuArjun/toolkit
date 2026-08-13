"use client";

import React, { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Play, Pause, RotateCcw, Settings, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Mode = "focus" | "shortBreak" | "longBreak";


export default function PomodoroPage() {
  const tool = TOOLS.find((t) => t.id === "pomodoro")!;
  
  const [mode, setMode] = useState<Mode>("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  const [settings, setSettings] = useState({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  
  const [showSettings, setShowSettings] = useState(false);
  const [cycles, setCycles] = useState(0);

  // Load settings from local storage if available
  useEffect(() => {
    const saved = localStorage.getItem("pomodoro-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        if (mode === "focus") setTimeLeft(parsed.focus * 60);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Timer finished
      playNotification();
      setIsActive(false);
      
      if (mode === "focus") {
        const newCycles = cycles + 1;
        setCycles(newCycles);
        if (newCycles % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
      } else {
        switchMode("focus");
      }
    }

    // Update document title
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    document.title = isActive ? `${m}:${s} - ${mode === 'focus' ? 'Focus' : 'Break'} | ToolKit` : "ToolKit";

    return () => {
      if (interval) clearInterval(interval);
      document.title = "ToolKit";
    };
  }, [isActive, timeLeft, mode, cycles]);

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(settings[newMode] * 60);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(settings[mode] * 60);
  };

  const playNotification = () => {
    try {
      const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
      audio.volume = 0.5;
      audio.play();
    } catch (e) {}
  };

  const saveSettings = () => {
    localStorage.setItem("pomodoro-settings", JSON.stringify(settings));
    setShowSettings(false);
    if (!isActive) {
      setTimeLeft(settings[mode] * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const total = settings[mode] * 60;
    return ((total - timeLeft) / total) * 100;
  };

  const getModeColor = () => {
    if (mode === "focus") return "text-accent-primary";
    if (mode === "shortBreak") return "text-accent-secondary";
    return "text-emerald-600";
  };

  const getModeBg = () => {
    if (mode === "focus") return "bg-accent-primary/20 border-accent-primary text-accent-primary";
    if (mode === "shortBreak") return "bg-accent-secondary/20 border-accent-secondary text-accent-secondary";
    return "bg-green-400/20 border-green-400 text-emerald-600";
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col items-center max-w-2xl mx-auto w-full space-y-8">
        
        {/* Navigation */}
        <div className="flex items-center gap-2 p-1 bg-bg-panel border border-border-line rounded-full">
          <button 
            onClick={() => switchMode("focus")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${mode === "focus" ? getModeBg() : "text-text-muted hover:text-text-primary"}`}
          >
            Focus
          </button>
          <button 
            onClick={() => switchMode("shortBreak")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${mode === "shortBreak" ? getModeBg() : "text-text-muted hover:text-text-primary"}`}
          >
            Short Break
          </button>
          <button 
            onClick={() => switchMode("longBreak")}
            className={`px-6 py-2 rounded-full font-mono text-sm transition-all ${mode === "longBreak" ? getModeBg() : "text-text-muted hover:text-text-primary"}`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center bg-bg-base rounded-full border border-border-line shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
            <circle 
              cx="50%" cy="50%" r="48%" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              className="text-border-line opacity-50"
            />
            <circle 
              cx="50%" cy="50%" r="48%" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="4" 
              strokeDasharray={`${Math.PI * 2 * 48}%`}
              strokeDashoffset={`${(Math.PI * 2 * 48) * (1 - getProgress() / 100)}%`}
              className={`${getModeColor()} transition-all duration-1000 ease-linear`}
            />
          </svg>
          
          <div className="flex flex-col items-center z-10">
            <span className={`text-7xl md:text-8xl font-bold font-mono tracking-tighter ${getModeColor()} drop-shadow-[0_0_15px_currentColor]`}>
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-sans font-medium text-text-muted mt-4 uppercase tracking-widest">
              {mode === "focus" ? "Stay Focused" : mode === "shortBreak" ? "Take a Breather" : "Extended Break"}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110 ${isActive ? 'bg-bg-panel border border-border-line text-text-muted' : getModeBg()}`}
          >
            {isActive ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          <button 
            onClick={resetTimer}
            className="w-12 h-12 rounded-full bg-bg-panel border border-border-line flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
          >
            <RotateCcw size={20} />
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${showSettings ? 'bg-accent-primary/20 border-accent-primary text-accent-primary' : 'bg-bg-panel border-border-line text-text-muted hover:text-text-primary'}`}
          >
            <Settings size={20} />
          </button>
        </div>

        {/* Cycles */}
        <div className="flex items-center gap-2 pt-4">
          <span className="text-xs font-sans font-medium text-text-muted uppercase tracking-widest mr-2">Cycles</span>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`w-3 h-3 rounded-full border ${cycles % 4 > i ? 'bg-accent-primary border-accent-primary shadow-[0_0_10px_rgba(0,102,204,0.8)]' : 'bg-transparent border-border-line'}`} />
          ))}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="w-full bg-bg-panel border border-border-line rounded-xl p-6 mt-8 animate-in slide-in-from-bottom-4 fade-in duration-200">
            <h3 className="text-sm font-bold font-sans font-medium text-accent-primary mb-6 uppercase tracking-wider">Timer Settings (Minutes)</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Focus</label>
                <Input 
                  type="number" 
                  min="1" max="90"
                  value={settings.focus}
                  onChange={(e) => setSettings({...settings, focus: parseInt(e.target.value) || 25})}
                  className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary text-center"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Short Break</label>
                <Input 
                  type="number" 
                  min="1" max="30"
                  value={settings.shortBreak}
                  onChange={(e) => setSettings({...settings, shortBreak: parseInt(e.target.value) || 5})}
                  className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary text-center"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Long Break</label>
                <Input 
                  type="number" 
                  min="1" max="60"
                  value={settings.longBreak}
                  onChange={(e) => setSettings({...settings, longBreak: parseInt(e.target.value) || 15})}
                  className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary text-center"
                />
              </div>
            </div>
            <button 
              onClick={saveSettings}
              className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold"
            >
              <CheckCircle2 size={16} /> Save & Apply
            </button>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}