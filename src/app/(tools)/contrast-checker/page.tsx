"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { colord, extend } from "colord";
import a11yPlugin from "colord/plugins/a11y";
import { CheckCircle2, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

extend([a11yPlugin]);


export default function ContrastCheckerPage() {
  const tool = TOOLS.find((t) => t.id === "contrast-checker")!;
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [bgColor, setBgColor] = useState("#0066CC");
  
  const [ratio, setRatio] = useState(0);
  const [isReadable, setIsReadable] = useState(true);
  const [scores, setScores] = useState({
    aaNormal: false,
    aaLarge: false,
    aaaNormal: false,
    aaaLarge: false
  });

  useEffect(() => {
    const text = colord(textColor);
    const bg = colord(bgColor);
    
    if (text.isValid() && bg.isValid()) {
      const contrast = bg.contrast(text);
      setRatio(contrast);
      setIsReadable(bg.isReadable(text)); // checks WCAG AA for normal text (ratio >= 4.5)
      
      setScores({
        aaNormal: contrast >= 4.5,
        aaLarge: contrast >= 3.0,
        aaaNormal: contrast >= 7.0,
        aaaLarge: contrast >= 4.5
      });
    }
  }, [textColor, bgColor]);

  const ScoreBadge = ({ pass, label }: { pass: boolean; label: string }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${pass ? "bg-green-500/10 border-green-500/30 text-green-500" : "bg-red-500/10 border-red-500/30 text-red-500"}`}>
      {pass ? <CheckCircle2 size={32} className="mb-2" /> : <XCircle size={32} className="mb-2" />}
      <span className="font-sans font-semibold">{pass ? "PASS" : "FAIL"}</span>
      <span className="text-xs text-text-muted mt-1">{label}</span>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col space-y-2 bg-bg-base p-4 border border-border-line rounded-lg">
            <label className="text-xs font-sans font-medium text-text-muted">Text Color</label>
            <div className="flex items-center gap-4">
              <Input 
                type="color" 
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <Input 
                type="text"
                value={textColor.toUpperCase()}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 bg-bg-base p-4 border border-border-line rounded-lg">
            <label className="text-xs font-sans font-medium text-text-muted">Background Color</label>
            <div className="flex items-center gap-4">
              <Input 
                type="color" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <Input 
                type="text"
                value={bgColor.toUpperCase()}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col">
          <div className="p-3 border border-border-line border-b-0 rounded-t-lg bg-bg-base">
            <span className="text-xs font-sans font-medium text-text-muted">Live Preview</span>
          </div>
          <div 
            className="p-12 rounded-b-lg border border-border-line text-center transition-colors duration-300"
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Large Text Preview</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              This is normal sized text preview. WCAG accessibility guidelines dictate that normal text should have a contrast ratio of at least 4.5:1 for AA compliance, and 7.0:1 for AAA compliance.
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center bg-bg-base p-8 border border-border-line rounded-xl">
          
          <div className="col-span-1 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border-line pb-8 lg:pb-0 lg:pr-8">
            <span className="text-xs font-sans font-medium text-text-muted mb-2">Contrast Ratio</span>
            <div className={`text-6xl font-bold font-mono ${isReadable ? "text-green-500" : "text-red-500"}`}>
              {ratio.toFixed(2)}
            </div>
            <span className="text-lg mt-2 text-text-primary">
              {isReadable ? "Looks Good!" : "Poor Contrast"}
            </span>
          </div>

          <div className="col-span-1 lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <ScoreBadge pass={scores.aaNormal} label="AA Normal" />
            <ScoreBadge pass={scores.aaLarge} label="AA Large" />
            <ScoreBadge pass={scores.aaaNormal} label="AAA Normal" />
            <ScoreBadge pass={scores.aaaLarge} label="AAA Large" />
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}