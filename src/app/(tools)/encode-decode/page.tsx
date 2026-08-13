"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, ArrowRightLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

type EncodeMode = "base64" | "url";


export default function EncodeDecodePage() {
  const tool = TOOLS.find((t) => t.id === "encode-decode")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<EncodeMode>("base64");
  const [action, setAction] = useState<"encode" | "decode">("encode");

  const processText = () => {
    setError(null);
    if (!input) {
      setOutput("");
      return;
    }
    
    try {
      if (mode === "base64") {
        if (action === "encode") {
          setOutput(btoa(unescape(encodeURIComponent(input))));
        } else {
          setOutput(decodeURIComponent(escape(atob(input))));
        }
      } else if (mode === "url") {
        if (action === "encode") {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(decodeURIComponent(input));
        }
      }
    } catch (e) {
      setError(`Failed to ${action} ${mode === "base64" ? "Base64" : "URL"}. Check your input format.`);
    }
  };

  // Auto-process when input/mode/action changes
  React.useEffect(() => {
    processText();
  }, [input, mode, action]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swap = () => {
    setInput(output);
    setAction(action === "encode" ? "decode" : "encode");
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-wrap items-center gap-4 p-4 border border-border-line rounded-lg bg-bg-base">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-medium text-text-muted">Format:</span>
            <select 
              className="bg-bg-panel border border-border-line rounded px-2 py-1 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              value={mode}
              onChange={(e) => setMode(e.target.value as EncodeMode)}
            >
              <option value="base64">Base64</option>
              <option value="url">URL Encoding</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2 border-l border-border-line pl-4">
            <span className="text-xs font-sans font-medium text-text-muted">Action:</span>
            <div className="flex bg-bg-base border border-border-line rounded overflow-hidden">
              <button 
                className={`px-3 py-1 text-sm font-mono ${action === "encode" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setAction("encode")}
              >
                Encode
              </button>
              <button 
                className={`px-3 py-1 text-sm font-mono ${action === "decode" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setAction("decode")}
              >
                Decode
              </button>
            </div>
          </div>
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
              placeholder={`Enter text to ${action}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="hidden lg:flex items-center justify-center -mx-4 z-10">
            <button 
              onClick={swap}
              className="p-2 bg-bg-panel border border-border-line rounded-full text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all"
              title="Swap input and output"
            >
              <ArrowRightLeft size={16} />
            </button>
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Output</span>
              <button 
                onClick={copyToClipboard}
                disabled={!output && !error}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
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
      </div>
    </ToolLayout>
  );
}