"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function RetroCrtPage() {
  const tool = TOOLS.find((t) => t.id === "retro-crt")!;
  const [text, setText] = useState("SYSTEM FAILURE");
  const [color, setColor] = useState<"green" | "amber" | "cyan" | "white">("green");
  const [scanlines, setScanlines] = useState(true);
  const [glitch, setGlitch] = useState(true);
  const [flicker, setFlicker] = useState(true);
  const [copied, setCopied] = useState(false);

  const getTextColorHex = () => {
    switch (color) {
      case "amber": return "#ffb000";
      case "cyan": return "#00ffff";
      case "white": return "#ffffff";
      case "green":
      default: return "#00ff00";
    }
  };

  const cssOutput = `/* Retro CRT CSS Effect */
.crt-container {
  background-color: #000;
  color: ${getTextColorHex()};
  font-family: 'Courier New', Courier, monospace;
  position: relative;
  overflow: hidden;
  text-shadow: 0 0 5px ${getTextColorHex()};
}
${scanlines ? `
/* Scanlines */
.crt-container::before {
  content: " ";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
  z-index: 2;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
}` : ""}
${flicker ? `
/* Flicker Animation */
.crt-container {
  animation: crt-flicker 0.15s infinite;
}
@keyframes crt-flicker {
  0% { opacity: 0.95; }
  50% { opacity: 0.85; }
  100% { opacity: 0.95; }
}` : ""}
${glitch ? `
/* Glitch Effect on Text */
.crt-text {
  position: relative;
  display: inline-block;
}
.crt-text::before,
.crt-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
}
.crt-text::before {
  left: 2px;
  text-shadow: -1px 0 red;
  clip: rect(24px, 550px, 90px, 0);
  animation: crt-glitch-anim-2 3s infinite linear alternate-reverse;
}
.crt-text::after {
  left: -2px;
  text-shadow: -1px 0 blue;
  clip: rect(85px, 550px, 140px, 0);
  animation: crt-glitch-anim 2.5s infinite linear alternate-reverse;
}
@keyframes crt-glitch-anim {
  0% { clip: rect(10px, 9999px, 31px, 0); }
  20% { clip: rect(62px, 9999px, 18px, 0); }
  40% { clip: rect(29px, 9999px, 84px, 0); }
  60% { clip: rect(87px, 9999px, 45px, 0); }
  80% { clip: rect(15px, 9999px, 92px, 0); }
  100% { clip: rect(53px, 9999px, 12px, 0); }
}
@keyframes crt-glitch-anim-2 {
  0% { clip: rect(65px, 9999px, 100px, 0); }
  20% { clip: rect(3px, 9999px, 24px, 0); }
  40% { clip: rect(86px, 9999px, 14px, 0); }
  60% { clip: rect(31px, 9999px, 63px, 0); }
  80% { clip: rect(14px, 9999px, 83px, 0); }
  100% { clip: rect(41px, 9999px, 99px, 0); }
}` : ""}
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      
      {/* Dynamic Style block to apply the effects inline for the preview */}
      <style dangerouslySetInnerHTML={{ __html: cssOutput.replace('.crt-container', '.crt-preview-container').replace('.crt-text', '.crt-preview-text') }} />

      <div className="flex flex-col space-y-8">
        
        {/* Preview Area */}
        <div className="w-full h-64 md:h-96 rounded-xl border-4 border-black/80 flex items-center justify-center crt-preview-container overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)_inset,0_0_15px_rgba(0,0,0,0.5)]">
          <div className="z-10 p-8 w-full text-center">
            <h1 
              className="text-4xl md:text-7xl font-bold tracking-widest uppercase crt-preview-text m-0 p-0"
              data-text={text || "TYPE SOMETHING"}
            >
              {text || "TYPE SOMETHING"}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="flex flex-col space-y-6 bg-bg-base p-6 border border-border-line rounded-xl h-fit">
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Display Text</label>
              <Input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                maxLength={20}
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary uppercase"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Phosphor Color</label>
              <div className="grid grid-cols-4 gap-2">
                <button onClick={() => setColor("green")} className={`py-2 px-3 text-xs font-mono rounded border ${color === "green" ? "bg-green-500/20 border-green-500 text-green-500" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Green</button>
                <button onClick={() => setColor("amber")} className={`py-2 px-3 text-xs font-mono rounded border ${color === "amber" ? "bg-yellow-500/20 border-yellow-500 text-yellow-500" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Amber</button>
                <button onClick={() => setColor("cyan")} className={`py-2 px-3 text-xs font-mono rounded border ${color === "cyan" ? "bg-cyan-500/20 border-cyan-500 text-cyan-500" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Cyan</button>
                <button onClick={() => setColor("white")} className={`py-2 px-3 text-xs font-mono rounded border ${color === "white" ? "bg-white/20 border-white text-white" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>White</button>
              </div>
            </div>

            <div className="flex flex-col space-y-4 pt-4 border-t border-border-line">
              <label className="flex items-center gap-3 cursor-pointer">
                <Input type="checkbox" checked={scanlines} onChange={(e) => setScanlines(e.target.checked)} className="accent-accent-primary w-4 h-4" />
                <span className="text-sm font-mono text-text-primary">Enable Scanlines</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Input type="checkbox" checked={flicker} onChange={(e) => setFlicker(e.target.checked)} className="accent-accent-primary w-4 h-4" />
                <span className="text-sm font-mono text-text-primary">Enable Screen Flicker</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Input type="checkbox" checked={glitch} onChange={(e) => setGlitch(e.target.checked)} className="accent-accent-primary w-4 h-4" />
                <span className="text-sm font-mono text-text-primary">Enable Text Glitch</span>
              </label>
            </div>

          </div>

          {/* Code Output */}
          <div className="flex flex-col bg-bg-panel border border-border-line rounded-xl overflow-hidden h-fit max-h-[500px]">
            <div className="p-4 border-b border-border-line bg-bg-base flex items-center justify-between sticky top-0 z-10 backdrop-blur-md">
              <span className="text-xs font-sans font-medium text-text-muted">CSS Output</span>
              <button 
                onClick={copyToClipboard}
                className="text-xs flex items-center gap-1 px-3 py-1.5 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy CSS
              </button>
            </div>
            <div className="p-4 overflow-auto">
              <pre className="font-mono text-xs text-text-primary whitespace-pre-wrap break-all">
                {cssOutput}
              </pre>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}