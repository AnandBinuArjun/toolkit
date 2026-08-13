"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function SvgPlaceholderPage() {
  const tool = TOOLS.find((t) => t.id === "svg-placeholder")!;
  
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#333333");
  const [textColor, setTextColor] = useState("#ffffff");
  const [text, setText] = useState("");
  const [copiedData, setCopiedData] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);

  const displayText = text || `${width}x${height}`;
  const fontSize = Math.min(width, height) * 0.2; // Auto font size

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${textColor}" font-family="monospace, sans-serif" font-size="${fontSize}px">${displayText}</text>
</svg>`;

  const dataUri = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svgCode)}`;

  const copyToClipboard = (content: string, type: 'data' | 'svg') => {
    navigator.clipboard.writeText(content);
    if (type === 'data') {
      setCopiedData(true);
      setTimeout(() => setCopiedData(false), 2000);
    } else {
      setCopiedSvg(true);
      setTimeout(() => setCopiedSvg(false), 2000);
    }
  };

  const downloadSvg = () => {
    const blob = new Blob([svgCode], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `placeholder-${width}x${height}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls */}
          <div className="lg:col-span-4 flex flex-col space-y-6 bg-bg-base p-6 border border-border-line rounded-xl h-fit">
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Dimensions (Width x Height)</label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  value={width} 
                  onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 100))}
                  className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
                <span className="text-text-muted">x</span>
                <Input 
                  type="number" 
                  value={height} 
                  onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 100))}
                  className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setWidth(1920); setHeight(1080); }} className="text-xs bg-bg-panel px-2 py-1 rounded text-text-muted hover:text-text-primary">1080p</button>
                <button onClick={() => { setWidth(1200); setHeight(630); }} className="text-xs bg-bg-panel px-2 py-1 rounded text-text-muted hover:text-text-primary">OG Image</button>
                <button onClick={() => { setWidth(800); setHeight(800); }} className="text-xs bg-bg-panel px-2 py-1 rounded text-text-muted hover:text-text-primary">Square</button>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Custom Text (Optional)</label>
              <Input 
                type="text" 
                value={text} 
                onChange={(e) => setText(e.target.value)}
                placeholder={`${width}x${height}`}
                className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Background</label>
                <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1">
                  <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <Input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Text Color</label>
                <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1">
                  <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <Input type="text" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Preview & Output */}
          <div className="lg:col-span-8 flex flex-col space-y-6">
            
            <div className="border border-border-line rounded-xl bg-bg-base overflow-hidden flex flex-col items-center justify-center p-8 relative min-h-[300px]">
              <div className="absolute top-4 left-4">
                <span className="text-xs font-sans font-medium text-text-muted bg-bg-panel px-2 py-1 rounded backdrop-blur">Preview</span>
              </div>
              
              <div 
                className="max-w-full shadow-2xl border border-white/10"
                style={{ 
                  aspectRatio: `${width}/${height}`, 
                  maxHeight: '400px',
                  width: width > height ? '100%' : 'auto',
                  height: height >= width ? '100%' : 'auto'
                }}
                dangerouslySetInnerHTML={{ __html: svgCode.replace('width', 'width="100%" height="100%" data-dummy') }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-panel border border-border-line rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-sans font-medium text-text-muted">Data URI (For src="")</span>
                  <button onClick={() => copyToClipboard(dataUri, 'data')} className="text-xs flex items-center gap-1 text-accent-secondary hover:text-white transition-colors">
                    {copiedData ? <Check size={14} /> : <Copy size={14} />} Copy
                  </button>
                </div>
                <Textarea 
                  readOnly 
                  value={dataUri} 
                  className="w-full h-20 bg-bg-base border border-border-line rounded p-2 font-mono text-xs text-text-primary resize-none outline-none"
                />
              </div>

              <div className="bg-bg-panel border border-border-line rounded-xl p-4 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-sans font-medium text-text-muted">Raw SVG Element</span>
                  <button onClick={() => copyToClipboard(svgCode, 'svg')} className="text-xs flex items-center gap-1 text-accent-primary hover:text-white transition-colors">
                    {copiedSvg ? <Check size={14} /> : <Copy size={14} />} Copy
                  </button>
                </div>
                <Textarea 
                  readOnly 
                  value={svgCode} 
                  className="w-full h-20 bg-bg-base border border-border-line rounded p-2 font-mono text-xs text-text-primary resize-none outline-none"
                />
              </div>
            </div>

            <button 
              onClick={downloadSvg}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold"
            >
              <Download size={18} /> Download .svg File
            </button>

          </div>

        </div>

      </div>
    </ToolLayout>
  );
}