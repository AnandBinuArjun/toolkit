"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Sparkles, Copy, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function FancyText() {
  const [text, setText] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const convertText = (str: string, style: string) => {
    const chars = str.split("");
    return chars.map(char => {
      const code = char.charCodeAt(0);
      // Map basic A-Z and a-z
      if (code >= 65 && code <= 90) {
        // Uppercase
        switch (style) {
          case 'math-bold-script': return String.fromCodePoint(code - 65 + 0x1D4D0);
          case 'math-double-struck': return String.fromCodePoint(code - 65 + 0x1D538);
          case 'math-sans-bold': return String.fromCodePoint(code - 65 + 0x1D5D4);
          case 'math-bold-fraktur': return String.fromCodePoint(code - 65 + 0x1D56C);
          case 'fullwidth': return String.fromCodePoint(code - 65 + 0xFF21);
          default: return char;
        }
      } else if (code >= 97 && code <= 122) {
        // Lowercase
        switch (style) {
          case 'math-bold-script': return String.fromCodePoint(code - 97 + 0x1D4EA);
          case 'math-double-struck': return String.fromCodePoint(code - 97 + 0x1D552);
          case 'math-sans-bold': return String.fromCodePoint(code - 97 + 0x1D5EE);
          case 'math-bold-fraktur': return String.fromCodePoint(code - 97 + 0x1D586);
          case 'fullwidth': return String.fromCodePoint(code - 97 + 0xFF41);
          default: return char;
        }
      }
      return char;
    }).join("");
  };

  const handleCopy = (res: string, idx: number) => {
    navigator.clipboard.writeText(res);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const styles = [
    { name: "Script", id: "math-bold-script" },
    { name: "Double Struck", id: "math-double-struck" },
    { name: "Sans Bold", id: "math-sans-bold" },
    { name: "Fraktur", id: "math-bold-fraktur" },
    { name: "Fullwidth", id: "fullwidth" },
  ];

  return (
    <ToolLayout id="fancy-text" name="Fancy Text" description="Convert normal text into fancy Unicode fonts for social media profiles and bios.">
      <div className="max-w-2xl mx-auto">
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            Original Text
          </div>
          <Textarea
            className="w-full bg-transparent p-4 outline-none font-mono text-lg resize-y min-h-[150px]"
            placeholder="Type your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {styles.map((style, idx) => {
            const converted = text ? convertText(text, style.id) : "Preview...";
            return (
              <div key={style.id} className="bg-bg-panel border border-border-line rounded-xl p-4 flex justify-between items-center group">
                <div className="flex-1 overflow-hidden">
                  <div className="text-xs text-text-muted font-mono uppercase mb-1">{style.name}</div>
                  <div className={`text-xl truncate ${!text ? 'opacity-30' : 'text-white'}`}>
                    {converted}
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(converted, idx)}
                  disabled={!text}
                  className="ml-4 p-3 rounded-lg bg-bg-panel border border-border-line text-accent-primary hover:text-white hover:border-accent-primary transition-colors disabled:opacity-30"
                >
                  {copiedIndex === idx ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}