"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { ArrowRightLeft, Copy, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

// Extremely simplified mapping for demonstration
// A real tool would use a full parser/AST or a dedicated library
const TAILWIND_TO_CSS: Record<string, string> = {
  "flex": "display: flex;",
  "items-center": "align-items: center;",
  "justify-center": "justify-content: center;",
  "w-full": "width: 100%;",
  "h-full": "height: 100%;",
  "text-center": "text-align: center;",
  "font-bold": "font-weight: bold;",
  "hidden": "display: none;",
  "block": "display: block;",
  "inline-block": "display: inline-block;",
  "relative": "position: relative;",
  "absolute": "position: absolute;",
  "p-4": "padding: 1rem;",
  "m-4": "margin: 1rem;",
  "bg-black": "background-color: #000;",
  "text-white": "color: #fff;",
  "rounded-lg": "border-radius: 0.5rem;",
  "shadow-md": "box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);",
};

const CSS_TO_TAILWIND = Object.fromEntries(
  Object.entries(TAILWIND_TO_CSS).map(([tw, css]) => [css.replace(";", "").trim(), tw])
);


export default function CSSTailwind() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"tw-to-css" | "css-to-tw">("tw-to-css");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) return "";
    
    if (direction === "tw-to-css") {
      const classes = input.split(/\s+/).filter(Boolean);
      const cssLines = classes.map(cls => {
        if (TAILWIND_TO_CSS[cls]) return `  ${TAILWIND_TO_CSS[cls]}`;
        // Arbitrary value fallback handling (e.g. w-[10px])
        const arbitraryMatch = cls.match(/^([a-z]+)-\[(.+)\]$/);
        if (arbitraryMatch) {
            const prop = arbitraryMatch[1] === 'w' ? 'width' : arbitraryMatch[1] === 'h' ? 'height' : arbitraryMatch[1] === 'bg' ? 'background' : arbitraryMatch[1] === 'text' ? 'color' : 'unknown';
            return `  ${prop}: ${arbitraryMatch[2]};`;
        }
        return `  /* Unknown Tailwind class: ${cls} */`;
      });
      return `{\n${cssLines.join("\n")}\n}`;
    } else {
      // Very crude CSS to Tailwind
      const lines = input.split(/[{;}]/).map(l => l.trim()).filter(Boolean);
      const twClasses = lines.map(line => {
        if (CSS_TO_TAILWIND[line]) return CSS_TO_TAILWIND[line];
        return `/* ${line} */`;
      });
      return twClasses.join(" ");
    }
  };

  const output = convert();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id="css-tailwind" name="CSS ↔ Tailwind" description="Convert CSS blocks to Tailwind utility classes, or vice versa (Basic Support).">
      <div className="bg-accent-primary/10 border border-accent-primary/20 text-accent-primary p-4 rounded-lg mb-6 text-sm">
        <strong>Note:</strong> This is a simplified client-side parser focusing on common structural classes. For full production conversions, use an AST-based bundler plugin.
      </div>

      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { setDirection(d => d === "tw-to-css" ? "css-to-tw" : "tw-to-css"); setInput(""); }}
          className="flex items-center gap-2 bg-bg-panel border border-border-line px-4 py-2 rounded-lg hover:border-accent-primary transition-colors text-sm"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Swap Direction: {direction === "tw-to-css" ? "Tailwind to CSS" : "CSS to Tailwind"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            {direction === "tw-to-css" ? "Input Tailwind Classes" : "Input CSS Block"}
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm resize-none min-h-[300px]"
            placeholder={direction === "tw-to-css" ? "flex items-center p-4 bg-black w-[500px]..." : "display: flex;\nalign-items: center;\npadding: 1rem;"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col relative">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
            <span>{direction === "tw-to-css" ? "Output CSS" : "Output Tailwind Classes"}</span>
            <button onClick={handleCopy} className="text-accent-primary hover:text-white transition-colors" title="Copy Output">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm text-text-muted resize-none min-h-[300px]"
            value={output}
            readOnly
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}