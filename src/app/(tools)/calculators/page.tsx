"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function Calculators() {
  const [aspectW1, setAspectW1] = useState(1920);
  const [aspectH1, setAspectH1] = useState(1080);
  const [aspectW2, setAspectW2] = useState(1280);
  const [aspectH2, setAspectH2] = useState(720);

  const handleAspectChange = (field: 'w1'|'h1'|'w2'|'h2', val: number) => {
    if (isNaN(val)) return;
    if (field === 'w1') {
      setAspectW1(val);
      setAspectH2(Math.round((val / aspectW1) * aspectH1)); // wait, that's not right.
      // If we change w1, the ratio changes, w2/h2 shouldn't necessarily change, but typically you want to find the missing one.
      // Let's do a simple proportional calc based on W1/H1 = W2/H2
    }
  };
  
  // Aspect Ratio Logic
  const calcAspect = (type: 'W2' | 'H2') => {
    if (type === 'W2') {
       const res = (aspectW1 / aspectH1) * aspectH2;
       setAspectW2(Math.round(res * 100) / 100);
    } else {
       const res = (aspectH1 / aspectW1) * aspectW2;
       setAspectH2(Math.round(res * 100) / 100);
    }
  };

  const [percNum, setPercNum] = useState(50);
  const [percOf, setPercOf] = useState(100);

  return (
    <ToolLayout id="quick-calculators" name="Quick Calculators" description="Calculate aspect ratios and percentages instantly.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Aspect Ratio */}
        <div className="bg-bg-panel border border-border-line rounded-xl p-6">
          <h3 className="font-bold mb-6 text-white border-b border-border-line pb-4">Aspect Ratio Calculator</h3>
          <div className="flex items-center gap-4 mb-4">
             <div className="flex-1">
               <label className="text-xs text-text-muted font-mono uppercase">Width (W1)</label>
               <Input type="number" className="w-full bg-bg-panel border border-border-line rounded p-2 text-white outline-none mt-1" value={aspectW1} onChange={e => setAspectW1(parseFloat(e.target.value) || 0)} />
             </div>
             <div className="text-text-muted font-bold mt-5">:</div>
             <div className="flex-1">
               <label className="text-xs text-text-muted font-mono uppercase">Height (H1)</label>
               <Input type="number" className="w-full bg-bg-panel border border-border-line rounded p-2 text-white outline-none mt-1" value={aspectH1} onChange={e => setAspectH1(parseFloat(e.target.value) || 0)} />
             </div>
          </div>

          <div className="flex justify-center text-text-muted font-mono text-sm mb-4">
            Equals (=)
          </div>

          <div className="flex items-center gap-4 mb-6">
             <div className="flex-1">
               <label className="text-xs text-text-muted font-mono uppercase">Width (W2)</label>
               <Input type="number" className="w-full bg-bg-panel border border-border-line rounded p-2 text-white outline-none mt-1" value={aspectW2} onChange={e => { setAspectW2(parseFloat(e.target.value) || 0); }} />
               <button onClick={() => calcAspect('W2')} className="text-[10px] text-accent-primary mt-1 hover:underline">Calculate W2</button>
             </div>
             <div className="text-text-muted font-bold mt-3">:</div>
             <div className="flex-1">
               <label className="text-xs text-text-muted font-mono uppercase">Height (H2)</label>
               <Input type="number" className="w-full bg-bg-panel border border-border-line rounded p-2 text-white outline-none mt-1" value={aspectH2} onChange={e => { setAspectH2(parseFloat(e.target.value) || 0); }} />
               <button onClick={() => calcAspect('H2')} className="text-[10px] text-accent-primary mt-1 hover:underline">Calculate H2</button>
             </div>
          </div>
        </div>

        {/* Percentage Calculator */}
        <div className="bg-bg-panel border border-border-line rounded-xl p-6">
          <h3 className="font-bold mb-6 text-white border-b border-border-line pb-4">Percentage Calculator</h3>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm font-sans font-medium text-text-muted">What is</span>
            <Input type="number" className="w-20 bg-bg-panel border border-border-line rounded p-2 text-white outline-none" value={percNum} onChange={e => setPercNum(parseFloat(e.target.value) || 0)} />
            <span className="text-sm font-sans font-medium text-text-muted">% of</span>
            <Input type="number" className="w-24 bg-bg-panel border border-border-line rounded p-2 text-white outline-none" value={percOf} onChange={e => setPercOf(parseFloat(e.target.value) || 0)} />
            <span className="text-sm font-sans font-medium text-text-muted">?</span>
          </div>
          
          <div className="bg-bg-panel border border-border-line rounded p-4 text-center">
            <div className="text-xs text-text-muted font-mono uppercase mb-2">Result</div>
            <div className="text-3xl font-bold text-accent-secondary">
               {(percNum / 100 * percOf).toFixed(2).replace(/\.00$/, '')}
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}