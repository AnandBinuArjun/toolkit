"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function RegexTesterPage() {
  const tool = TOOLS.find((t) => t.id === "regex-tester")!;
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gm");
  const [testString, setTestString] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{ start: number; end: number; text: string }[]>([]);

  useEffect(() => {
    setError(null);
    if (!pattern) {
      setMatchResult([]);
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const matches: { start: number; end: number; text: string }[] = [];
      
      let match;
      if (regex.global) {
        while ((match = regex.exec(testString)) !== null) {
          if (match[0].length === 0) {
            regex.lastIndex++; // Prevent infinite loops on empty matches
            continue; 
          }
          matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          matches.push({ start: match.index, end: match.index + match[0].length, text: match[0] });
        }
      }
      setMatchResult(matches);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid regular expression");
      }
      setMatchResult([]);
    }
  }, [pattern, flags, testString]);

  // Highlight logic
  const renderHighlightedText = () => {
    if (matchResult.length === 0) {
      return <span>{testString}</span>;
    }

    const nodes = [];
    let lastIndex = 0;

    matchResult.forEach((match, i) => {
      // Add text before match
      if (match.start > lastIndex) {
        nodes.push(<span key={`text-${i}`}>{testString.substring(lastIndex, match.start)}</span>);
      }
      // Add highlighted match
      nodes.push(
        <mark key={`match-${i}`} className="bg-accent-primary/40 text-text-primary rounded px-0.5 border-b border-accent-primary">
          {match.text}
        </mark>
      );
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      nodes.push(<span key={`text-end`}>{testString.substring(lastIndex)}</span>);
    }

    return nodes;
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[700px]">
        {/* Regex Input area */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-sans font-medium text-text-muted">Regular Expression</label>
          <div className="flex items-center bg-bg-panel border border-border-line rounded-lg overflow-hidden focus-within:border-accent-primary transition-colors">
            <span className="px-4 py-3 text-text-muted font-mono bg-bg-panel border-r border-border-line">/</span>
            <Input
              type="text"
              className="flex-1 px-4 py-3 bg-transparent font-mono text-sm text-text-primary focus:outline-none"
              placeholder="Enter regex pattern..."
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              spellCheck={false}
            />
            <span className="px-2 py-3 text-text-muted font-mono border-l border-border-line">/</span>
            <Input
              type="text"
              className="w-16 px-2 py-3 bg-transparent font-mono text-sm text-text-primary focus:outline-none"
              placeholder="gmi"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              spellCheck={false}
            />
          </div>
          {error && <div className="text-accent-danger text-xs font-mono mt-1">{error}</div>}
        </div>

        {/* Test String */}
        <div className="flex-1 flex flex-col mt-4">
          <label className="text-xs font-sans font-medium text-text-muted mb-2">Test String</label>
          <div className="relative flex-1 bg-bg-panel border border-border-line rounded-lg overflow-hidden focus-within:border-accent-primary transition-colors">
            {/* The highlighted text layer */}
            <div 
              className="absolute inset-0 p-4 font-mono text-sm whitespace-pre-wrap break-words pointer-events-none text-transparent"
              style={{ padding: '1rem', lineHeight: '1.5rem', fontFamily: 'var(--font-geist-mono)' }}
            >
              {renderHighlightedText()}
            </div>
            {/* The actual textarea */}
            <Textarea
              className="absolute inset-0 w-full h-full p-4 font-mono text-sm text-text-primary bg-transparent focus:outline-none resize-none caret-white"
              style={{ lineHeight: '1.5rem', fontFamily: 'var(--font-geist-mono)' }}
              placeholder="Enter text to test your regex against..."
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        
        {/* Match Stats */}
        <div className="bg-bg-panel border border-border-line p-3 rounded-lg flex items-center justify-between">
          <span className="text-xs font-sans font-medium text-text-muted">Matches found:</span>
          <span className={`text-sm font-sans font-semibold ${matchResult.length > 0 ? "text-accent-primary" : "text-text-muted"}`}>
            {matchResult.length}
          </span>
        </div>
      </div>
    </ToolLayout>
  );
}