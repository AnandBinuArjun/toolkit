"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { colord, extend } from "colord";
import cmykPlugin from "colord/plugins/cmyk";
import namesPlugin from "colord/plugins/names";
import { Copy, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

extend([cmykPlugin, namesPlugin]);


export default function ColorConverterPage() {
  const tool = TOOLS.find((t) => t.id === "color-converter")!;
  const [input, setInput] = useState("#0066cc");
  const [parsed, setParsed] = useState(colord("#0066cc"));
  const [isValid, setIsValid] = useState(true);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const c = colord(input);
    if (c.isValid()) {
      setParsed(c);
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [input]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [format]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [format]: false }));
    }, 2000);
  };

  const ColorRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-border-line last:border-0 hover:bg-bg-base transition-colors gap-4">
      <span className="text-sm font-sans font-medium text-accent-primary w-24 shrink-0">{label}</span>
      <span className="text-lg font-mono text-text-primary break-all flex-1">{value}</span>
      <button 
        onClick={() => copyToClipboard(value, label)}
        className="self-end md:self-auto p-2 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-colors"
        title="Copy"
      >
        {copiedMap[label] ? <Check size={18} /> : <Copy size={18} />}
      </button>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Input & Preview */}
        <div className="flex flex-col md:flex-row gap-8 items-center bg-bg-base p-8 border border-border-line rounded-xl">
          <div 
            className="w-32 h-32 md:w-48 md:h-48 rounded-full shadow-2xl border-4 border-black/40 transition-colors duration-300"
            style={{ backgroundColor: isValid ? parsed.toHex() : "transparent" }}
          />
          
          <div className="flex flex-col flex-1 w-full gap-4">
            <label className="text-xs font-sans font-medium text-text-muted uppercase tracking-wider">
              Enter any color format (HEX, RGB, HSL, CSS Name)
            </label>
            <div className="relative">
              <Input
                type="text"
                className={`w-full bg-bg-panel border-2 rounded-xl px-6 py-4 text-2xl font-mono text-text-primary focus:outline-none transition-colors ${
                  isValid ? "border-border-line focus:border-accent-primary" : "border-accent-danger"
                }`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. #ff0000, rgb(255,0,0), red..."
                spellCheck={false}
              />
              {!isValid && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-danger text-sm font-mono">
                  Invalid Color
                </span>
              )}
            </div>
            {isValid && (
              <div className="text-sm font-sans font-medium text-text-muted">
                Closest CSS Name: <strong className="text-accent-secondary">{parsed.toName({ closest: true }) || "None"}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Conversions */}
        <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden opacity-100 transition-opacity duration-300" style={{ opacity: isValid ? 1 : 0.5, pointerEvents: isValid ? "auto" : "none" }}>
          <div className="p-3 border-b border-border-line bg-bg-base">
            <span className="text-xs font-sans font-medium text-text-muted">Color Values</span>
          </div>
          <div className="flex flex-col">
            <ColorRow label="HEX" value={parsed.toHex().toUpperCase()} />
            <ColorRow label="RGB" value={parsed.toRgbString()} />
            <ColorRow label="HSL" value={parsed.toHslString()} />
            <ColorRow label="CMYK" value={parsed.toCmykString()} />
            <ColorRow 
              label="RGBA" 
              value={`rgba(${parsed.toRgb().r}, ${parsed.toRgb().g}, ${parsed.toRgb().b}, ${parsed.alpha()})`} 
            />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}