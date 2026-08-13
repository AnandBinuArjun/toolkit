"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function NumberBasePage() {
  const tool = TOOLS.find((t) => t.id === "number-base")!;
  
  const [dec, setDec] = useState("");
  const [hex, setHex] = useState("");
  const [bin, setBin] = useState("");
  const [oct, setOct] = useState("");
  
  const [error, setError] = useState<string | null>(null);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const updateFromBase = (value: string, base: number) => {
    try {
      if (!value.trim()) {
        setDec("");
        setHex("");
        setBin("");
        setOct("");
        setError(null);
        return;
      }

      // Check validity based on base
      let isValid = true;
      let parsed = BigInt(0);

      // Handle big integers to support large numbers
      if (base === 10) {
        if (!/^-?\d+$/.test(value)) isValid = false;
        else parsed = BigInt(value);
      } else if (base === 16) {
        if (!/^-?[0-9a-fA-F]+$/.test(value)) isValid = false;
        else parsed = BigInt("0x" + value.replace(/^-/, ''));
        if (value.startsWith('-')) parsed = -parsed;
      } else if (base === 2) {
        if (!/^-?[01]+$/.test(value)) isValid = false;
        else parsed = BigInt("0b" + value.replace(/^-/, ''));
        if (value.startsWith('-')) parsed = -parsed;
      } else if (base === 8) {
        if (!/^-?[0-7]+$/.test(value)) isValid = false;
        else parsed = BigInt("0o" + value.replace(/^-/, ''));
        if (value.startsWith('-')) parsed = -parsed;
      }

      if (!isValid) {
        setError(`Invalid base ${base} number`);
        return;
      }

      setError(null);
      
      const isNegative = parsed < BigInt(0);
      const absParsed = isNegative ? -parsed : parsed;
      const sign = isNegative ? "-" : "";

      if (base !== 10) setDec(parsed.toString(10));
      else setDec(value);
      
      if (base !== 16) setHex(sign + absParsed.toString(16).toUpperCase());
      else setHex(value.toUpperCase());
      
      if (base !== 2) setBin(sign + absParsed.toString(2));
      else setBin(value);
      
      if (base !== 8) setOct(sign + absParsed.toString(8));
      else setOct(value);

    } catch (e) {
      setError("Number too large or invalid format");
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const BaseInput = ({ label, value, base, onChange }: { label: string; value: string; base: number; onChange: (v: string) => void }) => (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-sans font-medium text-accent-primary uppercase tracking-wider">{label} (Base {base})</label>
        <button 
          onClick={() => copyToClipboard(value, label)}
          disabled={!value || !!error}
          className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-secondary transition-colors disabled:opacity-50"
        >
          {copiedMap[label] ? <Check size={14} /> : <Copy size={14} />} Copy
        </button>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value.trim())}
        className="w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-lg text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none break-all"
        rows={3}
        spellCheck={false}
      />
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Controls */}
        <div className="flex items-center justify-between bg-bg-base p-4 border border-border-line rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-sans font-medium text-text-muted">Type in any box to convert to others. Supports huge numbers.</span>
          </div>
          <button 
            onClick={() => updateFromBase("", 10)}
            className="text-xs flex items-center gap-1 px-3 py-1.5 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-danger transition-colors font-mono"
          >
            <Trash2 size={14} /> Clear All
          </button>
        </div>

        {error && (
          <div className="bg-accent-danger/10 border border-accent-danger text-accent-danger px-4 py-3 rounded-lg font-mono text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BaseInput label="Decimal" value={dec} base={10} onChange={(v) => { setDec(v); updateFromBase(v, 10); }} />
          <BaseInput label="Hexadecimal" value={hex} base={16} onChange={(v) => { setHex(v.toUpperCase()); updateFromBase(v, 16); }} />
          <BaseInput label="Binary" value={bin} base={2} onChange={(v) => { setBin(v); updateFromBase(v, 2); }} />
          <BaseInput label="Octal" value={oct} base={8} onChange={(v) => { setOct(v); updateFromBase(v, 8); }} />
        </div>

      </div>
    </ToolLayout>
  );
}