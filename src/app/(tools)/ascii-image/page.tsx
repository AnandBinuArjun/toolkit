"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Upload, Copy, Check, SlidersHorizontal, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

// Density string for ASCII mapping (dark to light)
const ASCII_CHARS = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";


export default function AsciiImagePage() {
  const tool = TOOLS.find((t) => t.id === "ascii-image")!;
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [asciiArt, setAsciiArt] = useState<string>("");
  const [resolution, setResolution] = useState(100);
  const [invert, setInvert] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAscii = () => {
    if (!imgRef.current || !canvasRef.current || !imageSrc) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imgRef.current;
    
    // Calculate new dimensions maintaining aspect ratio
    // A character is typically twice as tall as it is wide, so we divide height by 2
    const width = resolution;
    const height = Math.floor((img.height / img.width) * width * 0.5);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    let asciiStr = "";

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // Handle transparency
      if (a === 0) {
        asciiStr += " ";
        // Add newline if at end of row
        if ((i / 4 + 1) % width === 0) {
          asciiStr += "\n";
        }
        continue;
      }

      // Calculate relative luminance
      let brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      if (invert) {
        brightness = 1 - brightness;
      }

      const charIndex = Math.floor(brightness * (ASCII_CHARS.length - 1));
      asciiStr += ASCII_CHARS[charIndex];

      // Add newline if at end of row
      if ((i / 4 + 1) % width === 0) {
        asciiStr += "\n";
      }
    }

    setAsciiArt(asciiStr);
  };

  // Re-generate if resolution or invert changes while image is loaded
  React.useEffect(() => {
    if (imageSrc) {
      // Need slight delay to ensure img is fully rendered before drawing to canvas
      setTimeout(() => generateAscii(), 50);
    }
  }, [imageSrc, resolution, invert]);

  const copyToClipboard = () => {
    if (!asciiArt) return;
    navigator.clipboard.writeText(asciiArt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 max-w-6xl mx-auto w-full">
        
        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls & Input */}
          <div className="lg:col-span-4 flex flex-col space-y-6">
            
            <div className="flex flex-col space-y-4 bg-bg-base p-6 border border-border-line rounded-xl">
              
              {!imageSrc ? (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border-line rounded-xl hover:bg-bg-panel hover:border-accent-primary transition-colors cursor-pointer group">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload size={32} className="text-text-muted mb-3 group-hover:text-accent-primary transition-colors" />
                    <p className="text-sm font-sans font-medium text-text-muted group-hover:text-accent-primary">Click to upload an image</p>
                    <p className="text-xs font-sans font-medium text-text-muted mt-1 opacity-50">PNG, JPG, WEBP</p>
                  </div>
                  <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <div className="flex flex-col space-y-4">
                  <div className="relative rounded-lg overflow-hidden border border-border-line bg-bg-panel">
                    <img 
                      ref={imgRef}
                      src={imageSrc} 
                      alt="Original" 
                      className="w-full h-auto object-contain max-h-[300px]"
                      onLoad={generateAscii}
                    />
                    <label className="absolute bottom-2 right-2 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur border border-white/10 rounded cursor-pointer hover:bg-black transition-colors font-mono text-xs text-white">
                      <ImageIcon size={14} /> Change Image
                      <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex flex-col space-y-4 pt-4 border-t border-border-line">
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal size={16} className="text-accent-primary" />
                  <span className="text-sm font-bold font-mono text-text-primary">Options</span>
                </div>

                <div className="flex flex-col space-y-2">
                  <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                    <label>Resolution (Width in characters)</label>
                    <span>{resolution}</span>
                  </div>
                  <Input 
                    type="range" 
                    min="20" max="250" 
                    value={resolution} 
                    onChange={(e) => setResolution(parseInt(e.target.value))}
                    disabled={!imageSrc}
                    className="accent-accent-primary disabled:opacity-50"
                  />
                </div>

                <label className="flex items-center gap-3 cursor-pointer group mt-2">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${invert ? 'bg-accent-primary border-accent-primary text-black' : 'border-text-muted group-hover:border-accent-primary text-transparent'}`}>
                    <Check size={14} className={invert ? "opacity-100" : "opacity-0"} />
                  </div>
                  <span className="text-sm font-mono text-text-primary">Invert Colors (Dark Mode)</span>
                  <Input 
                    type="checkbox" 
                    className="hidden" 
                    checked={invert} 
                    onChange={(e) => setInvert(e.target.checked)}
                    disabled={!imageSrc}
                  />
                </label>
              </div>

            </div>

          </div>

          {/* Output */}
          <div className="lg:col-span-8 flex flex-col border border-border-line rounded-xl bg-bg-panel overflow-hidden min-h-[500px]">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center">
              <span className="text-xs font-sans font-medium text-text-muted">ASCII Output</span>
              <button 
                onClick={copyToClipboard}
                disabled={!asciiArt}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-medium disabled:opacity-50"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy Art
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-auto flex items-center justify-center bg-[#0a0a0a]">
              {asciiArt ? (
                <pre 
                  className="font-mono text-text-primary whitespace-pre leading-none tracking-tighter"
                  style={{ fontSize: '6px' }} // Tiny font size to fit the art
                >
                  {asciiArt}
                </pre>
              ) : (
                <span className="font-mono text-sm text-text-muted">Upload an image to see the ASCII art...</span>
              )}
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}