"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import zxcvbn from "zxcvbn";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function PasswordStrengthPage() {
  const tool = TOOLS.find((t) => t.id === "password-strength")!;
  
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const result = password ? zxcvbn(password) : null;

  const getScoreColor = (score: number) => {
    switch (score) {
      case 0: return "bg-red-500 border-red-500 text-red-500";
      case 1: return "bg-orange-500 border-orange-500 text-orange-500";
      case 2: return "bg-yellow-500 border-yellow-500 text-yellow-500";
      case 3: return "bg-blue-500 border-blue-500 text-blue-500";
      case 4: return "bg-green-500 border-green-500 text-green-500";
      default: return "bg-border-line border-border-line text-text-muted";
    }
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Good";
      case 4: return "Strong";
      default: return "None";
    }
  };

  const formatTime = (timeValue: string | number) => {
    const timeStr = String(timeValue);
    return timeStr.replace("centuries", "centuries 👴")
                  .replace("years", "years 📅")
                  .replace("months", "months 🗓️")
                  .replace("days", "days ☀️")
                  .replace("hours", "hours ⏳")
                  .replace("minutes", "minutes ⏱️")
                  .replace("seconds", "seconds ⚡")
                  .replace("less than a second", "less than a second 🚀");
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col items-center max-w-2xl mx-auto w-full space-y-8">
        
        <div className="w-full flex flex-col space-y-4">
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a password to test..."
              className="w-full bg-bg-panel border-2 border-border-line rounded-xl px-6 py-4 text-xl font-mono text-text-primary focus:outline-none focus:border-accent-primary transition-colors pr-12"
            />
            <button 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Strength Bars */}
          <div className="flex gap-2 h-2 w-full">
            {[0, 1, 2, 3].map((level) => (
              <div 
                key={level} 
                className={`flex-1 rounded-full transition-colors duration-300 ${result && result.score > level ? getScoreColor(result.score).split(' ')[0] : 'bg-bg-panel'}`}
              />
            ))}
          </div>
        </div>

        {result ? (
          <div className="w-full flex flex-col space-y-6">
            <div className="flex flex-col items-center justify-center p-6 bg-bg-base border border-border-line rounded-xl">
              <span className={`text-3xl font-bold font-mono ${getScoreColor(result.score).split(' ')[2]}`}>
                {getScoreLabel(result.score)}
              </span>
              <span className="text-sm font-sans font-medium text-text-muted mt-2">
                Estimated time to crack: <strong className="text-text-primary">{formatTime(result.crack_times_display.offline_slow_hashing_1e4_per_second)}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-panel border border-border-line rounded-xl p-4 flex flex-col space-y-2">
                <span className="text-xs font-bold font-mono text-accent-secondary uppercase tracking-widest">Feedback</span>
                {result.feedback.warning && (
                  <span className="text-sm font-mono text-accent-danger bg-accent-danger/10 px-3 py-2 rounded">
                    ⚠️ {result.feedback.warning}
                  </span>
                )}
                {result.feedback.suggestions.length > 0 ? (
                  <ul className="text-sm font-sans font-medium text-text-muted list-disc pl-4 space-y-1 mt-2">
                    {result.feedback.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                ) : (
                  <span className="text-sm font-mono text-emerald-600 mt-2">Looking good! No suggestions.</span>
                )}
              </div>

              <div className="bg-bg-panel border border-border-line rounded-xl p-4 flex flex-col space-y-3">
                <span className="text-xs font-bold font-sans font-medium text-accent-primary uppercase tracking-widest">Details</span>
                
                <div className="flex justify-between items-center border-b border-border-line pb-2">
                  <span className="text-sm font-sans font-medium text-text-muted">Guesses needed</span>
                  <span className="text-sm font-mono text-text-primary font-bold">{result.guesses.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center border-b border-border-line pb-2">
                  <span className="text-sm font-sans font-medium text-text-muted">Fast offline crack</span>
                  <span className="text-sm font-mono text-text-primary font-bold">{result.crack_times_display.offline_fast_hashing_1e10_per_second}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-sans font-medium text-text-muted">Online throttling crack</span>
                  <span className="text-sm font-mono text-text-primary font-bold">{result.crack_times_display.online_throttling_100_per_hour}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-center text-text-muted text-sm font-mono p-12 border border-dashed border-border-line rounded-xl">
            Enter a password to see its strength, entropy, and crack time estimates.
            <br />
            <br />
            <span className="text-accent-secondary opacity-70">🔒 Everything runs completely locally in your browser.</span>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}