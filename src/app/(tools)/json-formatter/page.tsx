"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, Code } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function JsonFormatterPage() {
  const tool = TOOLS.find((t) => t.id === "json-formatter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"READY" | "PROCESSING">("READY");

  const formatJson = (space: number) => {
    setStatus("PROCESSING");
    setError(null);
    try {
      if (!input.trim()) {
        setOutput("");
        setStatus("READY");
        return;
      }
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, space));
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid JSON");
      }
    } finally {
      setStatus("READY");
    }
  };

  const minifyJson = () => {
    formatJson(0);
  };

  const prettifyJson = () => {
    formatJson(2);
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description} status={status}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-medium text-text-muted">Input</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>
          <Textarea
            className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
            placeholder="Paste your JSON here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-medium text-text-muted">Output</span>
            <div className="flex gap-2">
              <button 
                onClick={prettifyJson}
                className="text-xs px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-primary hover:text-accent-primary transition-all font-mono"
              >
                Prettify
              </button>
              <button 
                onClick={minifyJson}
                className="text-xs px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-primary hover:text-accent-primary transition-all font-mono"
              >
                Minify
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
          </div>
          
          <div className="flex-1 relative rounded-lg border border-border-line overflow-hidden bg-bg-panel">
            {error ? (
              <div className="absolute inset-0 p-4 text-accent-danger font-mono text-sm overflow-auto">
                {error}
              </div>
            ) : (
              <Textarea
                className="w-full h-full p-4 font-mono text-sm text-text-primary bg-transparent focus:outline-none resize-none"
                value={output}
                readOnly
              />
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}