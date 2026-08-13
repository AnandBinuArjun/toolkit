"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

extend([harmoniesPlugin]);


export default function ColorPalettePage() {
  const tool = TOOLS.find((t) => t.id === "color-palette")!;
  const [baseColor, setBaseColor] = useState("#0066cc");
  const [harmony, setHarmony] = useState<"analogous" | "complementary" | "double-split-complementary" | "rectangle" | "split-complementary" | "tetradic" | "triadic">("analogous");
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generatePalette = (color: string, type: typeof harmony) => {
    try {
      const c = colord(color);
      if (!c.isValid()) return;
      
      const colors = c.harmonies(type).map(c => c.toHex());
      // harmonies plugin doesn't always include the base color at the start depending on the harmony, but usually we want it.
      // Actually, colord returns the full harmony array.
      setPalette(colors);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    generatePalette(baseColor, harmony);
  }, [baseColor, harmony]);

  const generateRandom = () => {
    const randomColor = colord({
      h: Math.floor(Math.random() * 360),
      s: Math.floor(Math.random() * 50) + 50,
      l: Math.floor(Math.random() * 40) + 30
    }).toHex();
    setBaseColor(randomColor);
  };

  const copyColor = (color: string, index: number) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-bg-base p-4 border border-border-line rounded-lg">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Input 
              type="color" 
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
            />
            <Input 
              type="text"
              value={baseColor.toUpperCase()}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-32 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto md:ml-auto">
            <span className="text-sm font-sans font-medium text-text-muted">Harmony:</span>
            <select
              className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary flex-1"
              value={harmony}
              onChange={(e) => setHarmony(e.target.value as any)}
            >
              <option value="analogous">Analogous</option>
              <option value="complementary">Complementary</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="triadic">Triadic</option>
              <option value="tetradic">Tetradic</option>
              <option value="rectangle">Rectangle</option>
            </select>
          </div>

          <button 
            onClick={generateRandom}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono"
          >
            <RefreshCw size={16} /> Random
          </button>
        </div>

        {/* Palette Display */}
        <div className="flex flex-col md:flex-row h-64 md:h-96 w-full rounded-xl overflow-hidden border border-border-line shadow-2xl">
          {palette.map((color, idx) => (
            <div 
              key={idx}
              className="flex-1 flex flex-col items-center justify-end p-4 transition-all hover:flex-[1.5] group relative"
              style={{ backgroundColor: color }}
            >
              <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                <button
                  onClick={() => copyColor(color, idx)}
                  className="bg-black/50 hover:bg-black/80 text-white rounded-full p-3 backdrop-blur-sm transition-colors"
                  title="Copy Hex"
                >
                  {copiedIndex === idx ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <div className="bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded font-mono text-sm w-full text-center">
                {color.toUpperCase()}
              </div>
            </div>
          ))}
        </div>
        
        {/* Color details */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {palette.map((color, idx) => {
            const c = colord(color);
            return (
              <div key={idx} className="bg-bg-base border border-border-line rounded-lg p-3 text-xs font-mono">
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">HEX</span>
                  <span className="text-text-primary">{c.toHex().toUpperCase()}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">RGB</span>
                  <span className="text-text-primary">{c.toRgb().r}, {c.toRgb().g}, {c.toRgb().b}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">HSL</span>
                  <span className="text-text-primary">{c.toHsl().h}, {c.toHsl().s}%, {c.toHsl().l}%</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </ToolLayout>
  );
}