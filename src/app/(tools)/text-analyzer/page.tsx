"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function TextAnalyzerPage() {
  const tool = TOOLS.find((t) => t.id === "text-analyzer")!;
  
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    chars: 0,
    charsNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
    speakingTime: 0,
  });
  const [density, setDensity] = useState<{ word: string; count: number; percent: number }[]>([]);

  useEffect(() => {
    // Basic stats
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = text.trim() ? text.split(/\n+/).filter(Boolean).length : 0;
    
    // Time estimates (Reading: ~238 wpm, Speaking: ~130 wpm)
    const readingTime = Math.ceil(words / 238);
    const speakingTime = Math.ceil(words / 130);

    setStats({ chars, charsNoSpaces, words, sentences, paragraphs, readingTime, speakingTime });

    // Keyword density
    if (words > 0) {
      const wordsArray = text.toLowerCase().match(/\b\w+\b/g) || [];
      const counts: Record<string, number> = {};
      
      // Stop words to filter out
      const stopWords = new Set(["the", "and", "a", "an", "in", "on", "of", "to", "for", "is", "it", "that", "with", "as", "by", "at", "this", "be", "from", "or"]);
      
      wordsArray.forEach(w => {
        if (!stopWords.has(w) && w.length > 2) {
          counts[w] = (counts[w] || 0) + 1;
        }
      });

      const densityArr = Object.entries(counts)
        .map(([word, count]) => ({ word, count, percent: (count / words) * 100 }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10); // Top 10

      setDensity(densityArr);
    } else {
      setDensity([]);
    }

  }, [text]);

  const StatCard = ({ label, value }: { label: string; value: string | number }) => (
    <div className="bg-bg-base border border-border-line rounded-lg p-4 flex flex-col items-center justify-center text-center">
      <span className="text-3xl font-bold font-sans font-medium text-accent-primary mb-1">{value}</span>
      <span className="text-xs font-sans font-medium text-text-muted uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Editor */}
        <div className="flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-medium text-text-muted">Input Text</span>
            <button 
              onClick={() => setText("")}
              className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          <Textarea
            className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
            placeholder="Type or paste text here to analyze..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Characters" value={stats.chars} />
          <StatCard label="Chars (No Space)" value={stats.charsNoSpaces} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Paragraphs" value={stats.paragraphs} />
          <StatCard label="Reading Time" value={`${stats.readingTime}m`} />
          <StatCard label="Speaking Time" value={`${stats.speakingTime}m`} />
        </div>

        {/* Keyword Density */}
        {density.length > 0 && (
          <div className="bg-bg-base border border-border-line rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border-line bg-bg-panel">
              <h3 className="text-sm font-bold font-mono text-accent-secondary">Keyword Density (Top 10)</h3>
              <p className="text-xs text-text-muted mt-1 font-mono">Common stop words are ignored.</p>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {density.map((d, i) => (
                <div key={i} className="flex flex-col bg-bg-panel border border-border-line rounded p-3 relative overflow-hidden group">
                  <div className="absolute left-0 bottom-0 top-0 bg-accent-secondary/10 transition-all" style={{ width: `${d.percent * 2}%` }} />
                  <div className="relative z-10 flex justify-between items-center">
                    <span className="font-bold text-text-primary">{d.word}</span>
                    <div className="text-right flex flex-col">
                      <span className="text-accent-secondary font-mono">{d.count}x</span>
                      <span className="text-xs text-text-muted font-mono">{d.percent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}