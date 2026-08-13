"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Scissors, Copy, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const optimizeSvg = (svgStr: string) => {
    if (!svgStr.trim()) return "";
    
    let opt = svgStr;
    // Remove XML prolog
    opt = opt.replace(/<\?xml.*?\?>/g, "");
    // Remove DOCTYPE
    opt = opt.replace(/<!DOCTYPE.*?>/gi, "");
    // Remove comments
    opt = opt.replace(/<!--[\s\S]*?-->/g, "");
    // Remove metadata tags
    opt = opt.replace(/<metadata.*?>[\s\S]*?<\/metadata>/g, "");
    // Remove title tags (optional, but typical for minification)
    opt = opt.replace(/<title.*?>[\s\S]*?<\/title>/g, "");
    // Remove desc tags
    opt = opt.replace(/<desc.*?>[\s\S]*?<\/desc>/g, "");
    // Remove editor specific attributes (sketch, inkscape, etc)
    opt = opt.replace(/(sketch|inkscape|sodipodi):[a-zA-Z0-9-]+\s*=\s*"[^"]*"/g, "");
    // Remove empty text nodes / extra whitespace between tags
    opt = opt.replace(/>\s+</g, "><");
    // Trim
    opt = opt.trim();

    return opt;
  };

  const output = optimizeSvg(input);
  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savings = inputSize > 0 ? ((inputSize - outputSize) / inputSize * 100).toFixed(1) : "0.0";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id="svg-optimizer" name="SVG Optimizer" description="Minify and clean SVG code by removing comments, metadata, and extraneous editor tags.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between">
            <span>Input SVG</span>
            <span>{inputSize > 0 ? (inputSize / 1024).toFixed(2) + " KB" : ""}</span>
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm resize-none min-h-[400px]"
            placeholder="<svg>...</svg>"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col relative">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
            <span className="flex items-center gap-4">
              <span>Optimized Output</span>
              {inputSize > 0 && (
                <span className="text-accent-secondary">Saved {savings}% ({(outputSize / 1024).toFixed(2)} KB)</span>
              )}
            </span>
            <button onClick={handleCopy} className="text-accent-primary hover:text-white transition-colors" title="Copy Output">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm text-text-muted resize-none min-h-[400px]"
            value={output}
            readOnly
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}