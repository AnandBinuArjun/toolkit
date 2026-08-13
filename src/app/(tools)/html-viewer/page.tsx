"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function HtmlViewerPage() {
  const tool = TOOLS.find((t) => t.id === "html-viewer")!;
  const [input, setInput] = useState(`<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
      font-family: sans-serif; 
      padding: 2rem; 
      text-align: center;
      background: #f0f0f0;
      color: #333;
    }
    h1 { color: #0066cc; }
    button { 
      padding: 10px 20px; 
      background: #0066cc; 
      color: white; 
      border: none; 
      border-radius: 4px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <h1>Hello HTML!</h1>
  <p>Edit the code on the left to see live changes.</p>
  <button onclick="alert('JavaScript works too!')">Click Me</button>
</body>
</html>`);

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[700px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
          {/* Input Side */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">HTML/CSS/JS Source</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Paste HTML here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Output Side */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Live Preview (Sandboxed iframe)</span>
            </div>
            
            <div className="flex-1 rounded-lg border border-border-line overflow-hidden bg-white">
              <iframe
                className="w-full h-full border-none"
                sandbox="allow-scripts"
                srcDoc={input}
                title="HTML Preview"
              />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}