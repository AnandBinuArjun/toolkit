"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function CaseConverterPage() {
  const tool = TOOLS.find((t) => t.id === "case-converter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [caseType, setCaseType] = useState<string>("camelCase");

  const convertCase = (text: string, type: string) => {
    if (!text) return "";
    
    // Split into words, handling different current cases
    // matches: camelCase boundaries, snake_case, kebab-case, spaces
    const words = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g) || [];
    
    switch (type) {
      case "camelCase":
        return words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      case "PascalCase":
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      case "snake_case":
        return words.map(w => w.toLowerCase()).join('_');
      case "SCREAMING_SNAKE_CASE":
        return words.map(w => w.toUpperCase()).join('_');
      case "kebab-case":
        return words.map(w => w.toLowerCase()).join('-');
      case "Train-Case":
        return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
      case "lowercase":
        return text.toLowerCase();
      case "UPPERCASE":
        return text.toUpperCase();
      case "Title Case":
        return text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      case "Sentence case":
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      default:
        return text;
    }
  };

  React.useEffect(() => {
    setOutput(convertCase(input, caseType));
  }, [input, caseType]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cases = [
    "camelCase", "PascalCase", "snake_case", "SCREAMING_SNAKE_CASE", 
    "kebab-case", "Train-Case", "lowercase", "UPPERCASE", 
    "Title Case", "Sentence case"
  ];

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap gap-2 p-4 border border-border-line rounded-lg bg-bg-base">
          {cases.map((c) => (
            <button
              key={c}
              onClick={() => setCaseType(c)}
              className={`px-3 py-1.5 text-xs font-mono rounded border transition-colors ${
                caseType === c 
                  ? "bg-accent-primary/20 border-accent-primary text-accent-primary" 
                  : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Enter text to convert..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Output ({caseType})</span>
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            
            <Textarea
              className="flex-1 w-full p-4 rounded-lg border border-border-line bg-bg-panel font-mono text-sm text-text-primary focus:outline-none resize-none"
              value={output}
              readOnly
            />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}