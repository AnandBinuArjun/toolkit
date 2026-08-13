"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { ArrowRightLeft } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function PxToRemPage() {
  const tool = TOOLS.find((t) => t.id === "px-to-rem")!;
  const [baseSize, setBaseSize] = useState<number>(16);
  const [pxValue, setPxValue] = useState<string>("16");
  const [remValue, setRemValue] = useState<string>("1");
  const [direction, setDirection] = useState<"px-to-rem" | "rem-to-px">("px-to-rem");

  const handleBaseSizeChange = (val: string) => {
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setBaseSize(num);
      // Recalculate based on current direction
      if (direction === "px-to-rem") {
        const px = parseFloat(pxValue);
        if (!isNaN(px)) setRemValue((px / num).toString());
      } else {
        const rem = parseFloat(remValue);
        if (!isNaN(rem)) setPxValue((rem * num).toString());
      }
    }
  };

  const handlePxChange = (val: string) => {
    setPxValue(val);
    setDirection("px-to-rem");
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setRemValue(+(num / baseSize).toFixed(4) + "");
    } else {
      setRemValue("");
    }
  };

  const handleRemChange = (val: string) => {
    setRemValue(val);
    setDirection("rem-to-px");
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setPxValue(+(num * baseSize).toFixed(4) + "");
    } else {
      setPxValue("");
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 h-[600px] items-center pt-12">
        
        {/* Base Size Settings */}
        <div className="bg-bg-base border border-border-line rounded-lg p-6 flex flex-col items-center max-w-md w-full">
          <label className="text-xs font-sans font-medium text-text-muted mb-2">Root Base Size (px)</label>
          <p className="text-xs text-text-muted mb-4 text-center">
            This is the font-size of the root &lt;html&gt; element. Standard is 16px.
          </p>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary text-center w-24 focus:outline-none focus:border-accent-primary"
              value={baseSize}
              onChange={(e) => handleBaseSizeChange(e.target.value)}
              min="1"
            />
            <span className="font-sans font-medium text-text-muted">px</span>
          </div>
        </div>

        {/* Converter Area */}
        <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-2xl justify-center">
          
          <div className="flex flex-col items-center">
            <label className="text-xs font-sans font-medium text-accent-primary mb-2">Pixels (PX)</label>
            <div className="relative">
              <Input
                type="number"
                className="bg-bg-panel border border-border-line rounded-lg px-4 py-6 text-3xl font-mono text-text-primary focus:outline-none focus:border-accent-primary w-48 text-center"
                value={pxValue}
                onChange={(e) => handlePxChange(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans font-medium text-text-muted opacity-50">px</span>
            </div>
          </div>

          <div className="p-4 text-text-muted">
            <ArrowRightLeft size={24} />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-xs font-mono text-accent-secondary mb-2">Root EM (REM)</label>
            <div className="relative">
              <Input
                type="number"
                className="bg-bg-panel border border-border-line rounded-lg px-4 py-6 text-3xl font-mono text-text-primary focus:outline-none focus:border-accent-secondary w-48 text-center"
                value={remValue}
                onChange={(e) => handleRemChange(e.target.value)}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-sans font-medium text-text-muted opacity-50">rem</span>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}