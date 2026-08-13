"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { QRCodeSVG } from "qrcode.react";
import { Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function QrCodePage() {
  const tool = TOOLS.find((t) => t.id === "qr-code")!;
  
  const [value, setValue] = useState("https://tools.sivin.dev");
  const [fgColor, setFgColor] = useState("#0066cc");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [margin, setMargin] = useState(4);
  const [transparentBg, setTransparentBg] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      // Create high-res canvas
      canvas.width = 1024;
      canvas.height = 1024;
      
      if (!transparentBg) {
        ctx!.fillStyle = bgColor;
        ctx!.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx!.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Controls */}
          <div className="flex flex-col space-y-6 bg-bg-base p-6 border border-border-line rounded-xl">
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Content (URL, text, email, etc.)</label>
              <Textarea 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter text or URL..."
                className="w-full h-32 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">QR Color</label>
                <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1">
                  <Input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <Input type="text" value={fgColor.toUpperCase()} onChange={(e) => setFgColor(e.target.value)} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Background Color</label>
                <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1 relative">
                  <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} disabled={transparentBg} className={`w-8 h-8 rounded cursor-pointer border-0 p-0 ${transparentBg ? 'opacity-50' : 'bg-transparent'}`} />
                  <Input type="text" value={transparentBg ? 'Transparent' : bgColor.toUpperCase()} onChange={(e) => setBgColor(e.target.value)} disabled={transparentBg} className={`w-full bg-transparent font-mono text-sm focus:outline-none ${transparentBg ? 'text-text-muted' : ''}`} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <Input type="checkbox" checked={transparentBg} onChange={(e) => setTransparentBg(e.target.checked)} className="accent-accent-primary" />
                <span className="text-xs font-mono text-text-primary">Transparent Background</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Error Correction Level</label>
                <select
                  className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  value={level}
                  onChange={(e) => setLevel(e.target.value as any)}
                >
                  <option value="L">L (7%)</option>
                  <option value="M">M (15%) - Default</option>
                  <option value="Q">Q (25%)</option>
                  <option value="H">H (30%) - Best for logos</option>
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Quiet Zone Margin</label>
                  <span>{margin} modules</span>
                </div>
                <Input 
                  type="range" 
                  min="0" max="10" 
                  value={margin} 
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>
            </div>

          </div>

          {/* Preview & Download */}
          <div className="flex flex-col bg-bg-panel border border-border-line rounded-xl overflow-hidden h-fit relative">
            <div className="p-4 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-text-muted">Live Preview</span>
            </div>
            <div className="p-12 flex items-center justify-center bg-[url('/checkers.png')] relative">
               <div className="absolute inset-0 bg-bg-base" style={{ backgroundImage: "linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
               
               <div 
                 ref={qrRef} 
                 className="relative z-10 p-4 rounded-xl shadow-2xl transition-all"
                 style={{ backgroundColor: transparentBg ? "transparent" : bgColor }}
               >
                 <QRCodeSVG 
                   value={value || " "}
                   size={256}
                   bgColor={transparentBg ? "transparent" : bgColor}
                   fgColor={fgColor}
                   level={level}
                   marginSize={margin}
                 />
               </div>
            </div>
            <div className="p-6 bg-bg-panel border-t border-border-line">
              <button 
                onClick={downloadQR}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold"
              >
                <Download size={18} /> Download High-Res PNG
              </button>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}