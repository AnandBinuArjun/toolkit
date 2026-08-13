"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

type Shadow = {
  hOffset: number;
  vOffset: number;
  blur: number;
  spread: number;
  color: string;
  inset: boolean;
};


export default function ShadowPlaygroundPage() {
  const tool = TOOLS.find((t) => t.id === "shadow-playground")!;
  
  const [shadows, setShadows] = useState<Shadow[]>([
    { hOffset: 0, vOffset: 10, blur: 20, spread: -5, color: "rgba(0, 0, 0, 0.5)", inset: false },
    { hOffset: 0, vOffset: 5, blur: 10, spread: -3, color: "rgba(0, 0, 0, 0.3)", inset: false }
  ]);
  const [bgColor, setBgColor] = useState("#242424");
  const [boxColor, setBoxColor] = useState("#333333");
  const [cssString, setCssString] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const shadowStr = shadows.map(s => {
      const parts = [
        s.inset ? "inset" : "",
        `${s.hOffset}px`,
        `${s.vOffset}px`,
        `${s.blur}px`,
        `${s.spread}px`,
        s.color
      ].filter(Boolean).join(" ");
      return parts;
    }).join(",\n  ");
    
    setCssString(shadowStr || "none");
  }, [shadows]);

  const updateShadow = (index: number, key: keyof Shadow, value: any) => {
    const newShadows = [...shadows];
    newShadows[index] = { ...newShadows[index], [key]: value };
    setShadows(newShadows);
  };

  const addShadow = () => {
    if (shadows.length >= 6) return;
    setShadows([...shadows, { hOffset: 0, vOffset: 0, blur: 10, spread: 0, color: "rgba(0, 0, 0, 0.5)", inset: false }]);
  };

  const removeShadow = (index: number) => {
    const newShadows = [...shadows];
    newShadows.splice(index, 1);
    setShadows(newShadows);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`box-shadow: ${cssString};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to convert hex + alpha to rgba string for input fields
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16) || 0;
    const g = parseInt(hex.slice(3, 5), 16) || 0;
    const b = parseInt(hex.slice(5, 7), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const parseRgba = (rgba: string) => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),?\s*([\d.]+)?\)/);
    if (!match) return { hex: "#000000", alpha: 1 };
    
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    const a = match[4] ? parseFloat(match[4]) : 1;
    
    return { hex: `#${r}${g}${b}`, alpha: a };
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Preview Area */}
        <div 
          className="w-full h-80 rounded-xl border border-border-line flex items-center justify-center transition-colors overflow-hidden relative"
          style={{ backgroundColor: bgColor }}
        >
          <div className="absolute top-4 left-4 flex gap-4 bg-black/50 p-2 rounded backdrop-blur border border-white/10">
             <div className="flex items-center gap-2">
                <Input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer p-0 border-0 bg-transparent" />
                <span className="text-xs font-mono text-white">BG</span>
             </div>
             <div className="flex items-center gap-2">
                <Input type="color" value={boxColor} onChange={e => setBoxColor(e.target.value)} className="w-6 h-6 rounded cursor-pointer p-0 border-0 bg-transparent" />
                <span className="text-xs font-mono text-white">Box</span>
             </div>
          </div>
          
          <div 
            className="w-48 h-48 rounded-2xl transition-all duration-300"
            style={{ 
              backgroundColor: boxColor,
              boxShadow: cssString
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-sans font-medium text-text-muted">Shadow Layers</h3>
              <button
                onClick={addShadow}
                disabled={shadows.length >= 6}
                className="text-xs flex items-center gap-1 bg-accent-primary/20 text-accent-primary px-3 py-1.5 rounded hover:bg-accent-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus size={14} /> Add Shadow
              </button>
            </div>
            
            <div className="flex flex-col space-y-4">
              {shadows.map((shadow, i) => {
                const parsedColor = parseRgba(shadow.color);
                
                return (
                  <div key={i} className="flex flex-col space-y-4 bg-bg-base p-5 border border-border-line rounded-xl">
                    <div className="flex justify-between items-center border-b border-border-line pb-3">
                      <span className="text-sm font-bold text-accent-secondary">Layer {i + 1}</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Input 
                            type="checkbox" 
                            className="accent-accent-secondary"
                            checked={shadow.inset}
                            onChange={(e) => updateShadow(i, "inset", e.target.checked)}
                          />
                          <span className="text-xs font-sans font-medium text-text-muted">Inset</span>
                        </label>
                        <button
                          onClick={() => removeShadow(i)}
                          className="p-1 text-text-muted hover:text-accent-danger transition-colors shrink-0"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Sliders */}
                      <div className="flex flex-col space-y-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                            <span>H-Offset</span>
                            <span>{shadow.hOffset}px</span>
                          </div>
                          <Input type="range" min="-100" max="100" value={shadow.hOffset} onChange={(e) => updateShadow(i, "hOffset", parseInt(e.target.value))} className="accent-accent-secondary" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                            <span>V-Offset</span>
                            <span>{shadow.vOffset}px</span>
                          </div>
                          <Input type="range" min="-100" max="100" value={shadow.vOffset} onChange={(e) => updateShadow(i, "vOffset", parseInt(e.target.value))} className="accent-accent-secondary" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-3">
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                            <span>Blur</span>
                            <span>{shadow.blur}px</span>
                          </div>
                          <Input type="range" min="0" max="100" value={shadow.blur} onChange={(e) => updateShadow(i, "blur", parseInt(e.target.value))} className="accent-accent-secondary" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                            <span>Spread</span>
                            <span>{shadow.spread}px</span>
                          </div>
                          <Input type="range" min="-50" max="50" value={shadow.spread} onChange={(e) => updateShadow(i, "spread", parseInt(e.target.value))} className="accent-accent-secondary" />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex-1 flex flex-col space-y-1">
                        <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                          <span>Color Opacity</span>
                          <span>{Math.round(parsedColor.alpha * 100)}%</span>
                        </div>
                        <Input 
                          type="range" 
                          min="0" max="100" 
                          value={Math.round(parsedColor.alpha * 100)} 
                          onChange={(e) => updateShadow(i, "color", hexToRgba(parsedColor.hex, parseInt(e.target.value) / 100))} 
                          className="accent-accent-secondary" 
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4 shrink-0">
                        <Input 
                          type="color" 
                          value={parsedColor.hex}
                          onChange={(e) => updateShadow(i, "color", hexToRgba(e.target.value, parsedColor.alpha))}
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              {shadows.length === 0 && (
                <div className="text-center p-8 border border-dashed border-border-line rounded-xl text-text-muted font-mono text-sm">
                  No shadows added. Click "Add Shadow" to start.
                </div>
              )}
            </div>
          </div>

          {/* Code Output */}
          <div className="flex flex-col bg-bg-panel border border-border-line rounded-xl overflow-hidden h-fit sticky top-8">
            <div className="p-4 border-b border-border-line bg-bg-base flex items-center justify-between">
              <span className="text-xs font-sans font-medium text-text-muted">CSS Output</span>
              <button 
                onClick={copyToClipboard}
                disabled={shadows.length === 0}
                className="text-xs flex items-center gap-1 px-3 py-1.5 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy CSS
              </button>
            </div>
            <div className="p-6">
              <pre className="font-mono text-sm text-text-primary whitespace-pre-wrap break-all">
                <span className="text-accent-secondary">box-shadow:</span> {cssString};
              </pre>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}