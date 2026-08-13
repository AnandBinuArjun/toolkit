"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

type Direction = "top" | "bottom" | "left" | "right" | "top-left" | "top-right" | "bottom-left" | "bottom-right";


export default function CssTrianglePage() {
  const tool = TOOLS.find((t) => t.id === "css-triangle")!;
  
  const [direction, setDirection] = useState<Direction>("top");
  const [color, setColor] = useState("#0066cc");
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [copied, setCopied] = useState(false);

  // Generate CSS based on direction
  const getCss = () => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    
    let borders = "";
    
    switch (direction) {
      case "top":
        borders = `border-left: ${halfWidth}px solid transparent;\n  border-right: ${halfWidth}px solid transparent;\n  border-bottom: ${height}px solid ${color};`;
        break;
      case "bottom":
        borders = `border-left: ${halfWidth}px solid transparent;\n  border-right: ${halfWidth}px solid transparent;\n  border-top: ${height}px solid ${color};`;
        break;
      case "left":
        borders = `border-top: ${halfHeight}px solid transparent;\n  border-bottom: ${halfHeight}px solid transparent;\n  border-right: ${width}px solid ${color};`;
        break;
      case "right":
        borders = `border-top: ${halfHeight}px solid transparent;\n  border-bottom: ${halfHeight}px solid transparent;\n  border-left: ${width}px solid ${color};`;
        break;
      case "top-left":
        borders = `border-top: ${height}px solid ${color};\n  border-right: ${width}px solid transparent;`;
        break;
      case "top-right":
        borders = `border-top: ${height}px solid ${color};\n  border-left: ${width}px solid transparent;`;
        break;
      case "bottom-left":
        borders = `border-bottom: ${height}px solid ${color};\n  border-right: ${width}px solid transparent;`;
        break;
      case "bottom-right":
        borders = `border-bottom: ${height}px solid ${color};\n  border-left: ${width}px solid transparent;`;
        break;
    }

    return `.triangle {\n  width: 0;\n  height: 0;\n  ${borders}\n}`;
  };

  const cssCode = getCss();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getActiveStyle = (dir: Direction) => {
    return direction === dir ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted";
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-5 flex flex-col space-y-6 bg-bg-base p-6 border border-border-line rounded-xl h-fit">
            
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-sans font-medium text-text-muted">Direction</label>
              
              <div className="grid grid-cols-3 gap-2 w-full max-w-[240px] mx-auto aspect-square p-4 bg-bg-panel border border-border-line rounded-xl">
                {/* Top Row */}
                <button onClick={() => setDirection("top-left")} className={`rounded border flex items-center justify-center ${getActiveStyle("top-left")}`}>
                  <div className="w-0 h-0 border-t-8 border-r-8 border-r-transparent border-t-current" />
                </button>
                <button onClick={() => setDirection("top")} className={`rounded border flex items-center justify-center ${getActiveStyle("top")}`}>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-8 border-b-current" />
                </button>
                <button onClick={() => setDirection("top-right")} className={`rounded border flex items-center justify-center ${getActiveStyle("top-right")}`}>
                  <div className="w-0 h-0 border-t-8 border-l-8 border-l-transparent border-t-current" />
                </button>
                
                {/* Middle Row */}
                <button onClick={() => setDirection("left")} className={`rounded border flex items-center justify-center ${getActiveStyle("left")}`}>
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-8 border-r-current" />
                </button>
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 bg-border-line rounded-full opacity-50" />
                </div>
                <button onClick={() => setDirection("right")} className={`rounded border flex items-center justify-center ${getActiveStyle("right")}`}>
                  <div className="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-8 border-l-current" />
                </button>

                {/* Bottom Row */}
                <button onClick={() => setDirection("bottom-left")} className={`rounded border flex items-center justify-center ${getActiveStyle("bottom-left")}`}>
                  <div className="w-0 h-0 border-b-8 border-r-8 border-r-transparent border-b-current" />
                </button>
                <button onClick={() => setDirection("bottom")} className={`rounded border flex items-center justify-center ${getActiveStyle("bottom")}`}>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-8 border-t-current" />
                </button>
                <button onClick={() => setDirection("bottom-right")} className={`rounded border flex items-center justify-center ${getActiveStyle("bottom-right")}`}>
                  <div className="w-0 h-0 border-b-8 border-l-8 border-l-transparent border-b-current" />
                </button>
              </div>

            </div>

            <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
              <label className="text-xs font-sans font-medium text-text-muted">Color</label>
              <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1">
                <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                <Input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Width</label>
                  <span>{width}px</span>
                </div>
                <Input 
                  type="range" 
                  min="10" max="300" 
                  value={width} 
                  onChange={(e) => setWidth(parseInt(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Height</label>
                  <span>{height}px</span>
                </div>
                <Input 
                  type="range" 
                  min="10" max="300" 
                  value={height} 
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>
            </div>

          </div>

          {/* Preview & Output */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            <div className="border border-border-line rounded-xl bg-bg-base overflow-hidden flex flex-col items-center justify-center p-8 relative min-h-[350px]">
              <div className="absolute top-4 left-4">
                <span className="text-xs font-sans font-medium text-text-muted bg-bg-panel px-2 py-1 rounded backdrop-blur border border-border-line">Preview</span>
              </div>
              
              <div className="bg-[url('/checkers.png')] p-12 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center w-full h-full">
                 <div className="absolute inset-0 bg-bg-base" style={{ backgroundImage: "linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
                 {/* The Actual Triangle */}
                 <div 
                   className="relative z-10 transition-all duration-200"
                   style={{
                     width: 0,
                     height: 0,
                     ...(direction === "top" ? { borderLeft: `${width / 2}px solid transparent`, borderRight: `${width / 2}px solid transparent`, borderBottom: `${height}px solid ${color}` } : {}),
                     ...(direction === "bottom" ? { borderLeft: `${width / 2}px solid transparent`, borderRight: `${width / 2}px solid transparent`, borderTop: `${height}px solid ${color}` } : {}),
                     ...(direction === "left" ? { borderTop: `${height / 2}px solid transparent`, borderBottom: `${height / 2}px solid transparent`, borderRight: `${width}px solid ${color}` } : {}),
                     ...(direction === "right" ? { borderTop: `${height / 2}px solid transparent`, borderBottom: `${height / 2}px solid transparent`, borderLeft: `${width}px solid ${color}` } : {}),
                     ...(direction === "top-left" ? { borderTop: `${height}px solid ${color}`, borderRight: `${width}px solid transparent` } : {}),
                     ...(direction === "top-right" ? { borderTop: `${height}px solid ${color}`, borderLeft: `${width}px solid transparent` } : {}),
                     ...(direction === "bottom-left" ? { borderBottom: `${height}px solid ${color}`, borderRight: `${width}px solid transparent` } : {}),
                     ...(direction === "bottom-right" ? { borderBottom: `${height}px solid ${color}`, borderLeft: `${width}px solid transparent` } : {}),
                   }}
                 />
              </div>
            </div>

            <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-3 border-b border-border-line bg-bg-base">
                <span className="text-xs font-sans font-medium text-text-muted">CSS Output</span>
                <button onClick={copyToClipboard} className="text-xs flex items-center gap-1 text-accent-primary hover:text-white transition-colors">
                  {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <div className="p-4">
                <pre className="font-mono text-xs text-text-primary whitespace-pre-wrap selection:bg-accent-primary selection:text-black">
                  {cssCode}
                </pre>
              </div>
            </div>

          </div>

        </div>

      </div>
    </ToolLayout>
  );
}