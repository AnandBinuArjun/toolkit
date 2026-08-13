"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, RefreshCw } from "lucide-react";
import { LoremIpsum } from "lorem-ipsum";
import { Input } from "@/components/ui/input";


export default function LoremIpsumPage() {
  const tool = TOOLS.find((t) => t.id === "lorem-ipsum")!;
  
  const [count, setCount] = useState(3);
  const [format, setFormat] = useState<"paragraphs" | "words" | "sentences">("paragraphs");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4
    },
    wordsPerSentence: {
      max: 16,
      min: 4
    }
  });

  const generateText = () => {
    try {
      let text = "";
      if (format === "paragraphs") {
        text = lorem.generateParagraphs(count);
      } else if (format === "sentences") {
        text = lorem.generateSentences(count);
      } else {
        text = lorem.generateWords(count);
      }
      setOutput(text);
    } catch (e) {
      setOutput("Error generating text.");
    }
  };

  useEffect(() => {
    generateText();
  }, [count, format]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-base p-4 border border-border-line rounded-lg">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <label className="text-xs font-sans font-medium text-text-muted">Count:</label>
            <Input 
              type="number" 
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              className="w-24 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto flex-1">
            <label className="text-xs font-sans font-medium text-text-muted">Type:</label>
            <div className="flex bg-bg-base border border-border-line rounded overflow-hidden w-full max-w-md">
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono ${format === "paragraphs" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setFormat("paragraphs")}
              >
                Paragraphs
              </button>
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono border-l border-r border-border-line ${format === "sentences" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setFormat("sentences")}
              >
                Sentences
              </button>
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono ${format === "words" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setFormat("words")}
              >
                Words
              </button>
            </div>
          </div>

          <button 
            onClick={generateText}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono"
          >
            <RefreshCw size={16} /> Regenerate
          </button>
        </div>

        {/* Output Area */}
        <div className="flex flex-col border border-border-line rounded-lg bg-bg-panel overflow-hidden min-h-[400px]">
          <div className="p-3 border-b border-border-line bg-bg-base flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-text-muted">
              Generated {count} {format}
            </span>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="text-xs flex items-center gap-1 px-3 py-1.5 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} Copy Text
            </button>
          </div>
          <div className="p-6 flex-1 bg-bg-base">
            <p className="font-serif text-lg leading-relaxed text-text-primary whitespace-pre-wrap">
              {output}
            </p>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}