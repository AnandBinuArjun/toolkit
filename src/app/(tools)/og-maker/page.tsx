"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Download, RefreshCw, Image as ImageIcon } from "lucide-react";
import html2canvas from "html2canvas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function OgMakerPage() {
  const tool = TOOLS.find((t) => t.id === "og-maker")!;
  
  const [title, setTitle] = useState("Make Your OpenGraph Cards Pop");
  const [description, setDescription] = useState("A simple, beautiful tool to generate social media preview images on the fly. No server required.");
  const [author, setAuthor] = useState("ToolKit");
  const [avatarUrl, setAvatarUrl] = useState("");
  
  const [theme, setTheme] = useState<"dark" | "light" | "gradient">("dark");
  const [layout, setLayout] = useState<"centered" | "split">("centered");
  
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateImage = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // 2x for retina quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: null
      });
      
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "og-image.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Failed to generate image", e);
    } finally {
      setIsGenerating(false);
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "light": return "bg-white text-gray-900 border-gray-200";
      case "gradient": return "bg-gradient-to-br from-[#ff0080] to-[#7928ca] text-white border-white/20";
      case "dark":
      default: return "bg-[#111111] text-white border-white/10";
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Workspace - Fixed 1200x630 Aspect Ratio */}
        <div className="w-full max-w-4xl mx-auto overflow-hidden bg-[url('/checkers.png')] rounded-xl border border-border-line relative shadow-2xl">
           <div className="absolute inset-0 bg-bg-base" style={{ backgroundImage: "linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
           
           <div className="relative w-full pb-[52.5%]"> {/* 630 / 1200 = 52.5% */}
             <div className="absolute inset-0 flex items-center justify-center p-4">
                
                {/* The actual card to snapshot (fixed dimensions, scaled down via CSS for preview) */}
                <div 
                  className="overflow-hidden relative transform origin-center transition-all duration-300 shadow-2xl" 
                  style={{ width: 1200, height: 630, zoom: 0.5 }}
                >
                  <div 
                    ref={cardRef}
                    className={`w-full h-full p-16 flex border-4 ${getThemeClasses()} ${layout === "centered" ? "flex-col items-center justify-center text-center" : "flex-row items-center justify-between text-left"}`}
                  >
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-80" />
                    <div className={`absolute bottom-0 right-0 w-64 h-64 bg-current opacity-[0.03] rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2`} />
                    <div className={`absolute top-0 left-0 w-64 h-64 bg-current opacity-[0.03] rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2`} />

                    {layout === "centered" ? (
                      <>
                        <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
                          <h1 className="text-7xl font-bold tracking-tight mb-8 leading-tight">{title}</h1>
                          <p className="text-3xl opacity-80 mb-16 leading-relaxed font-light">{description}</p>
                          <div className="flex items-center gap-6 mt-auto bg-black/10 px-8 py-4 rounded-full backdrop-blur-sm">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-current/20" />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-current opacity-10 flex items-center justify-center" />
                            )}
                            <span className="text-3xl font-semibold">{author}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="max-w-2xl flex flex-col z-10">
                          <h1 className="text-7xl font-bold tracking-tight mb-8 leading-tight">{title}</h1>
                          <p className="text-3xl opacity-80 mb-16 leading-relaxed font-light">{description}</p>
                          <div className="flex items-center gap-6 mt-auto">
                            {avatarUrl ? (
                              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-current/20" />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-current opacity-10 flex items-center justify-center" />
                            )}
                            <span className="text-3xl font-semibold">{author}</span>
                          </div>
                        </div>
                        <div className="w-96 h-96 border-8 border-current/10 rounded-3xl rotate-12 flex items-center justify-center bg-black/5 backdrop-blur-md z-10 shadow-2xl relative overflow-hidden">
                           <ImageIcon className="w-32 h-32 opacity-20 text-current" />
                        </div>
                      </>
                    )}
                  </div>
                </div>

             </div>
           </div>
        </div>

        {/* Editor Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 flex flex-col space-y-4 bg-bg-base p-6 border border-border-line rounded-xl">
            <h3 className="text-sm font-bold font-sans font-medium text-accent-primary border-b border-border-line pb-2">Content</h3>
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Title</label>
              <Input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Description</label>
              <Textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-24 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Author / Brand Name</label>
                <Input 
                  type="text" 
                  value={author} 
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Avatar URL (optional)</label>
                <Input 
                  type="text" 
                  value={avatarUrl} 
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col space-y-6">
            <div className="bg-bg-base p-6 border border-border-line rounded-xl flex flex-col space-y-6">
              <h3 className="text-sm font-bold font-mono text-accent-secondary border-b border-border-line pb-2">Styling</h3>
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Theme</label>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => setTheme("dark")} className={`py-2 px-3 text-xs font-mono rounded border ${theme === "dark" ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Dark</button>
                  <button onClick={() => setTheme("light")} className={`py-2 px-3 text-xs font-mono rounded border ${theme === "light" ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Light</button>
                  <button onClick={() => setTheme("gradient")} className={`py-2 px-3 text-xs font-mono rounded border ${theme === "gradient" ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Gradient</button>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Layout</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setLayout("centered")} className={`py-2 px-3 text-xs font-mono rounded border ${layout === "centered" ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Centered</button>
                  <button onClick={() => setLayout("split")} className={`py-2 px-3 text-xs font-mono rounded border ${layout === "split" ? "bg-accent-secondary/20 border-accent-secondary text-accent-secondary" : "bg-bg-panel border-border-line text-text-muted hover:border-text-muted"}`}>Split</button>
                </div>
              </div>
              
              <button 
                onClick={generateImage}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-semibold mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <Download size={18} />} 
                {isGenerating ? "Rendering..." : "Download OG Image"}
              </button>
            </div>
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}