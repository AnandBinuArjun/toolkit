"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function ListCleanerPage() {
  const tool = TOOLS.find((t) => t.id === "list-cleaner")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ before: 0, after: 0, removed: 0 });

  // Options
  const [removeDuplicates, setRemoveDuplicates] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [sortList, setSortList] = useState<"none" | "asc" | "desc">("none");
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  const cleanList = () => {
    if (!input) {
      setOutput("");
      setStats({ before: 0, after: 0, removed: 0 });
      return;
    }

    let lines = input.split("\n");
    const beforeCount = lines.length;

    if (trimLines) {
      lines = lines.map(l => l.trim());
    }

    if (removeEmpty) {
      lines = lines.filter(l => l !== "");
    }

    if (removeDuplicates) {
      if (caseInsensitive) {
        const seen = new Set();
        lines = lines.filter(l => {
          const lower = l.toLowerCase();
          if (seen.has(lower)) return false;
          seen.add(lower);
          return true;
        });
      } else {
        lines = Array.from(new Set(lines));
      }
    }

    if (sortList !== "none") {
      lines.sort((a, b) => {
        const valA = caseInsensitive ? a.toLowerCase() : a;
        const valB = caseInsensitive ? b.toLowerCase() : b;
        if (sortList === "asc") return valA.localeCompare(valB);
        return valB.localeCompare(valA);
      });
    }

    setOutput(lines.join("\n"));
    setStats({
      before: beforeCount,
      after: lines.length,
      removed: beforeCount - lines.length
    });
  };

  React.useEffect(() => {
    cleanList();
  }, [input, removeDuplicates, removeEmpty, trimLines, sortList, caseInsensitive]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[700px]">
        
        {/* Settings Panel */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 border border-border-line rounded-lg bg-bg-base">
          <label className="flex items-center gap-2 cursor-pointer">
            <Input 
              type="checkbox" 
              className="accent-accent-primary" 
              checked={removeDuplicates} 
              onChange={(e) => setRemoveDuplicates(e.target.checked)} 
            />
            <span className="text-sm font-mono text-text-primary">Remove Duplicates</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Input 
              type="checkbox" 
              className="accent-accent-primary" 
              checked={removeEmpty} 
              onChange={(e) => setRemoveEmpty(e.target.checked)} 
            />
            <span className="text-sm font-mono text-text-primary">Remove Empty</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Input 
              type="checkbox" 
              className="accent-accent-primary" 
              checked={trimLines} 
              onChange={(e) => setTrimLines(e.target.checked)} 
            />
            <span className="text-sm font-mono text-text-primary">Trim Lines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <Input 
              type="checkbox" 
              className="accent-accent-primary" 
              checked={caseInsensitive} 
              onChange={(e) => setCaseInsensitive(e.target.checked)} 
            />
            <span className="text-sm font-mono text-text-primary">Case Insensitive</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-medium text-text-muted">Sort:</span>
            <select 
              className="bg-bg-panel border border-border-line rounded px-2 py-1 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary w-full"
              value={sortList}
              onChange={(e) => setSortList(e.target.value as "none" | "asc" | "desc")}
            >
              <option value="none">None</option>
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input ({stats.before} lines)</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Paste your list here (one item per line)..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex gap-4">
                <span className="text-xs font-sans font-medium text-text-muted">Output ({stats.after} lines)</span>
                {stats.removed > 0 && (
                  <span className="text-xs font-sans font-medium text-accent-primary px-2 bg-accent-primary/20 rounded">
                    Removed {stats.removed}
                  </span>
                )}
              </div>
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}