"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check } from "lucide-react";
import figlet from "figlet";
// @ts-ignore - figlet fonts might not have types
import standardFont from "figlet/importable-fonts/Standard.js";
// @ts-ignore
import ghostFont from "figlet/importable-fonts/Ghost.js";
// @ts-ignore
import doomFont from "figlet/importable-fonts/Doom.js";
import { Input } from "@/components/ui/input";

// Register fonts for browser use
figlet.parseFont("Standard", standardFont);
figlet.parseFont("Ghost", ghostFont);
figlet.parseFont("Doom", doomFont);


export default function AsciiBannerPage() {
  const tool = TOOLS.find((t) => t.id === "ascii-banner")!;
  const [text, setText] = useState("ToolKit");
  const [font, setFont] = useState<"Standard" | "Ghost" | "Doom">("Standard");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!text.trim()) {
        setOutput("");
        return;
      }
      
      const result = figlet.textSync(text, {
        font: font,
        horizontalLayout: "default",
        verticalLayout: "default",
        width: 120,
        whitespaceBreak: true
      });
      setOutput(result);
    } catch (e) {
      console.error(e);
      setOutput("Error generating banner. Please try a different font or text.");
    }
  }, [text, font]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Output */}
        <div className="relative border border-border-line rounded-lg bg-bg-panel overflow-hidden min-h-[300px] flex flex-col">
          <div className="p-3 border-b border-border-line bg-bg-base flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-text-muted">ASCII Output</span>
            <button 
              onClick={copyToClipboard}
              disabled={!output}
              className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />} Copy
            </button>
          </div>
          <div className="p-6 overflow-auto flex-1 flex items-center justify-center bg-black/60">
            <pre className="font-mono text-xs sm:text-sm text-text-primary whitespace-pre text-accent-primary drop-shadow-[0_0_8px_rgba(0,102,204,0.5)]">
              {output || "Type something..."}
            </pre>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-bg-base p-6 border border-border-line rounded-xl">
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-sans font-medium text-text-muted">Text</label>
            <Input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
              className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-sans font-medium text-text-muted">Font Style</label>
            <select
              className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              value={font}
              onChange={(e) => setFont(e.target.value as any)}
            >
              <option value="Standard">Standard</option>
              <option value="Ghost">Ghost</option>
              <option value="Doom">Doom</option>
            </select>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}