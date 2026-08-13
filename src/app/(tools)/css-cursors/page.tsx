"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check } from "lucide-react";

const CURSORS = [
  // General
  "auto", "default", "none",
  // Links & Status
  "context-menu", "help", "pointer", "progress", "wait",
  // Selection
  "cell", "crosshair", "text", "vertical-text",
  // Drag & Drop
  "alias", "copy", "move", "no-drop", "not-allowed", "grab", "grabbing",
  // Resizing & Scrolling
  "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize",
  "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize",
  "nesw-resize", "nwse-resize",
  // Zoom
  "zoom-in", "zoom-out"
];


export default function CssCursorsPage() {
  const tool = TOOLS.find((t) => t.id === "css-cursors")!;
  
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (cursor: string) => {
    navigator.clipboard.writeText(`cursor: ${cursor};`);
    setCopied(cursor);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        <div className="bg-accent-primary/10 border border-accent-primary/30 rounded-xl p-6 text-center">
          <h3 className="text-lg font-bold font-sans font-medium text-accent-primary mb-2">Hover over the cards below</h3>
          <p className="text-sm font-sans font-medium text-text-muted">
            The cursor will change to match the CSS property. Click any card to copy the CSS rule.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {CURSORS.map((cursor) => (
            <div
              key={cursor}
              onClick={() => copyToClipboard(cursor)}
              className="flex flex-col items-center justify-center p-6 bg-bg-base border border-border-line rounded-xl hover:bg-bg-panel hover:border-accent-primary transition-colors group relative overflow-hidden"
              style={{ cursor }}
              title={`cursor: ${cursor};`}
            >
              {/* Copied Overlay */}
              <div className={`absolute inset-0 bg-accent-primary/90 flex flex-col items-center justify-center transition-opacity duration-200 z-10 ${copied === cursor ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Check size={24} className="text-black mb-1" />
                <span className="text-black font-bold font-mono text-xs">Copied!</span>
              </div>
              
              <span className="font-mono text-sm text-text-primary group-hover:text-accent-primary transition-colors z-0 select-none text-center break-all">
                {cursor}
              </span>
              
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-accent-primary">
                <Copy size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </ToolLayout>
  );
}