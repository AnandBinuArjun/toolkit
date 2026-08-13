"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { BookOpen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function Readability() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    sentences: 0,
    syllables: 0,
    score: 0,
    grade: "",
  });

  // Very basic syllable counter
  const countSyllables = (word: string) => {
    word = word.toLowerCase();
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
  };

  useEffect(() => {
    if (!text.trim()) {
      setStats({ words: 0, sentences: 0, syllables: 0, score: 0, grade: "" });
      return;
    }

    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length || 1;
    const wordsArr = text.match(/\b[-?(\w+)?]+\b/gi) || [];
    const words = wordsArr.length || 1;
    
    let syllables = 0;
    for (const w of wordsArr) {
      syllables += countSyllables(w);
    }

    // Flesch Reading Ease
    // 206.835 - 1.015(Total Words / Total Sentences) - 84.6(Total Syllables / Total Words)
    let score = 206.835 - (1.015 * (words / sentences)) - (84.6 * (syllables / words));
    score = Math.max(0, Math.min(100, score)); // clamp 0-100 roughly

    let grade = "College Graduate";
    if (score >= 90) grade = "5th Grade (Very Easy)";
    else if (score >= 80) grade = "6th Grade (Easy)";
    else if (score >= 70) grade = "7th Grade (Fairly Easy)";
    else if (score >= 60) grade = "8th-9th Grade (Standard)";
    else if (score >= 50) grade = "10th-12th Grade (Fairly Difficult)";
    else if (score >= 30) grade = "College (Difficult)";

    setStats({
      words,
      sentences,
      syllables,
      score: parseFloat(score.toFixed(1)),
      grade
    });

  }, [text]);

  return (
    <ToolLayout id="readability-analyzer" name="Readability Analyzer" description="Calculate the Flesch Reading Ease score and grade level of your text.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            Enter Text
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none text-sm resize-none min-h-[400px] leading-relaxed"
            placeholder="Paste your article, essay, or copy here to analyze its readability..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-4">
           <div className="bg-bg-panel border border-border-line rounded-xl p-6 text-center">
             <div className="text-xs font-sans font-medium text-text-muted uppercase tracking-wider mb-2">Reading Ease Score</div>
             <div className={`text-5xl font-bold ${stats.score > 60 ? 'text-accent-secondary' : stats.score > 40 ? 'text-yellow-500' : 'text-accent-danger'}`}>
               {stats.score}
             </div>
             <div className="text-xs text-faint mt-2">0 (Hard) - 100 (Easy)</div>
           </div>
           
           <div className="bg-bg-panel border border-border-line rounded-xl p-6 text-center">
             <div className="text-xs font-sans font-medium text-text-muted uppercase tracking-wider mb-2">Estimated Level</div>
             <div className="text-lg font-semibold text-white">
               {stats.grade || "-"}
             </div>
           </div>

           <div className="bg-bg-panel border border-border-line rounded-xl p-4 grid grid-cols-2 gap-4 text-center mt-auto">
             <div>
               <div className="text-xl font-mono text-white">{stats.words}</div>
               <div className="text-[10px] uppercase tracking-widest text-text-muted">Words</div>
             </div>
             <div>
               <div className="text-xl font-mono text-white">{stats.sentences}</div>
               <div className="text-[10px] uppercase tracking-widest text-text-muted">Sentences</div>
             </div>
             <div>
               <div className="text-xl font-mono text-white">{stats.syllables}</div>
               <div className="text-[10px] uppercase tracking-widest text-text-muted">Syllables</div>
             </div>
             <div>
               <div className="text-xl font-mono text-white">{stats.words > 0 ? (stats.words / stats.sentences).toFixed(1) : 0}</div>
               <div className="text-[10px] uppercase tracking-widest text-text-muted">Words/Sent</div>
             </div>
           </div>
        </div>
      </div>
    </ToolLayout>
  );
}