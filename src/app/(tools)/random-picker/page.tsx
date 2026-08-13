"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Shuffle, RefreshCw, X, Gift } from "lucide-react";
import confetti from "canvas-confetti";
import { Textarea } from "@/components/ui/textarea";


export default function RandomPickerPage() {
  const tool = TOOLS.find((t) => t.id === "random-picker")!;
  
  const [items, setItems] = useState<string>("Pizza\nBurgers\nSushi\nTacos\nSalad");
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayedItem, setDisplayedItem] = useState<string | null>(null);

  const getValidItems = () => items.split("\n").map(i => i.trim()).filter(i => i.length > 0);

  const pickWinner = () => {
    const validItems = getValidItems();
    if (validItems.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    
    let spins = 0;
    const maxSpins = 20;
    const interval = 80;

    const spinInterval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * validItems.length);
      setDisplayedItem(validItems[randomIndex]);
      spins++;

      if (spins >= maxSpins) {
        clearInterval(spinInterval);
        const finalWinner = validItems[Math.floor(Math.random() * validItems.length)];
        setWinner(finalWinner);
        setDisplayedItem(finalWinner);
        setIsSpinning(false);
        
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0066cc', '#004c99', '#ffffff']
        });
      }
    }, interval);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input Area */}
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between items-center bg-bg-base p-4 border border-border-line rounded-lg">
              <span className="text-sm font-bold font-mono text-text-primary">Options (One per line)</span>
              <span className="text-xs font-sans font-medium text-accent-primary">{getValidItems().length} items</span>
            </div>
            <Textarea
              className="w-full h-80 bg-bg-panel border border-border-line rounded-xl p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none leading-relaxed"
              placeholder="Enter items to choose from..."
              value={items}
              onChange={(e) => setItems(e.target.value)}
              spellCheck={false}
            />
            <button 
              onClick={() => setItems("")}
              className="text-xs flex items-center justify-center gap-1 text-text-muted hover:text-accent-danger transition-colors font-mono self-start"
            >
              <X size={14} /> Clear List
            </button>
          </div>

          {/* Result Area */}
          <div className="flex flex-col h-full">
            
            <div className={`flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border-4 transition-all duration-300 relative overflow-hidden ${
              winner 
                ? 'bg-accent-primary/20 border-accent-primary shadow-[0_0_40px_rgba(0,102,204,0.3)]' 
                : isSpinning 
                  ? 'bg-black/60 border-border-line scale-95' 
                  : 'bg-bg-base border-border-line border-dashed'
            }`}>
              
              {isSpinning || winner ? (
                <div className="flex flex-col items-center text-center z-10 space-y-4">
                  {winner && <span className="text-sm font-bold font-sans font-medium text-accent-primary uppercase tracking-widest animate-fade-in">Winner!</span>}
                  <span className={`font-serif leading-tight break-words max-w-full px-4 ${winner ? 'text-5xl md:text-6xl text-text-primary font-bold' : 'text-3xl text-text-muted blur-[1px]'}`}>
                    {displayedItem}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center text-text-muted space-y-4 opacity-50">
                  <Gift size={64} className="mb-2" />
                  <span className="font-mono text-lg">Ready to pick</span>
                  <span className="font-mono text-xs">Enter at least 2 items</span>
                </div>
              )}

              {/* Background gradient effect when winning */}
              {winner && (
                <div className="absolute inset-0 bg-gradient-to-tr from-accent-primary/10 via-transparent to-transparent pointer-events-none" />
              )}
            </div>

            <button 
              onClick={pickWinner}
              disabled={isSpinning || getValidItems().length < 2}
              className="w-full mt-6 flex items-center justify-center gap-2 px-8 py-5 bg-accent-primary/20 border border-accent-primary rounded-xl text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              <Shuffle size={24} className={isSpinning ? 'animate-spin' : 'group-hover:animate-pulse'} /> 
              {isSpinning ? "Picking..." : "Pick a Random Winner"}
            </button>

          </div>

        </div>

      </div>
    </ToolLayout>
  );
}