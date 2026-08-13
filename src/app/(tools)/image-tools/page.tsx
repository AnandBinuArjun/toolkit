"use client";

import React, { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Download, UploadCloud, X, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

const PRESETS = [
  { label: "HD", w: 1280, h: 720 },
  { label: "FHD", w: 1920, h: 1080 },
  { label: "4K", w: 3840, h: 2160 },
  { label: "Twitter", w: 1500, h: 500 },
  { label: "OG Image", w: 1200, h: 630 },
  { label: "Square", w: 1080, h: 1080 },
];

const FAVICON_SIZES = [16, 32, 48, 64, 128, 256];


export default function ImageToolsPage() {
  const tool = TOOLS.find((t) => t.id === "image-tools")!;

  const [file, setFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDim, setOriginalDim] = useState({ w: 0, h: 0 });
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [exportingFavicons, setExportingFavicons] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) { setImageSrc(null); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageSrc(src);
      const img = new Image();
      img.onload = () => {
        setOriginalDim({ w: img.width, h: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  }, [file]);

  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (maintainAspect && originalDim.w > 0) {
      setHeight(Math.round(val * (originalDim.h / originalDim.w)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (maintainAspect && originalDim.h > 0) {
      setWidth(Math.round(val * (originalDim.w / originalDim.h)));
    }
  };

  const applyPreset = (w: number, h: number) => { setWidth(w); setHeight(h); };
  const applyScale = (scale: number) => {
    setWidth(Math.round(originalDim.w * scale));
    setHeight(Math.round(originalDim.h * scale));
  };

  const drawToCanvas = (targetW: number, targetH: number): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      const img = new Image();
      img.onload = () => {
        canvas.width = targetW;
        canvas.height = targetH;
        ctx.drawImage(img, 0, 0, targetW, targetH);
        resolve(canvas.toDataURL("image/png"));
      };
      img.src = imageSrc!;
    });
  };

  const downloadResized = async () => {
    if (!imageSrc) return;
    const dataUrl = await drawToCanvas(width, height);
    const a = document.createElement("a");
    a.download = `resized-${width}x${height}.png`;
    a.href = dataUrl;
    a.click();
  };

  const exportFaviconPack = async () => {
    if (!imageSrc) return;
    setExportingFavicons(true);
    for (const size of FAVICON_SIZES) {
      const dataUrl = await drawToCanvas(size, size);
      const a = document.createElement("a");
      a.download = `favicon-${size}x${size}.png`;
      a.href = dataUrl;
      a.click();
      await new Promise((r) => setTimeout(r, 120));
    }
    setExportingFavicons(false);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        <canvas ref={canvasRef} className="hidden" />

        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border-line rounded-2xl bg-bg-base hover:border-accent-primary hover:bg-bg-panel transition-colors cursor-pointer relative group">
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <UploadCloud size={64} className="text-text-muted mb-6 group-hover:text-accent-primary transition-colors" />
            <h3 className="text-xl font-bold font-mono text-text-primary mb-2">Drop an image here</h3>
            <p className="text-text-muted text-sm font-mono">PNG, JPG, WEBP, GIF � Resizing processed 100% locally</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-7 flex flex-col bg-bg-base border border-border-line rounded-xl overflow-hidden relative">
              <button
                onClick={() => { setFile(null); setImageSrc(null); }}
                className="absolute top-4 right-4 bg-black/60 hover:bg-accent-danger text-white p-2 rounded-full backdrop-blur transition-colors z-10"
              >
                <X size={20} />
              </button>
              <div className="flex-1 p-4 flex items-center justify-center overflow-auto relative min-h-[280px]"
                style={{ backgroundImage: "linear-gradient(45deg, #1a1a1a 25%, transparent 25%), linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1a1a1a 75%), linear-gradient(-45deg, transparent 75%, #1a1a1a 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }}>
                <img src={imageSrc} alt="Preview" className="max-w-full max-h-[50vh] object-contain shadow-2xl" />
              </div>
              <div className="bg-bg-panel border-t border-border-line p-3 flex justify-between text-xs font-sans font-medium text-text-muted">
                <span>Original: {originalDim.w} x {originalDim.h}px</span>
                <span>Output: {width} x {height}px</span>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col space-y-4">

              <div className="bg-bg-base p-5 border border-border-line rounded-xl flex flex-col space-y-4">
                <h3 className="text-xs font-bold font-sans font-medium text-accent-primary uppercase tracking-widest border-b border-border-line pb-2">Dimensions</h3>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="text-xs font-sans font-medium text-text-muted">Width (px)</label>
                    <Input type="number" value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary text-sm" />
                  </div>
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="text-xs font-sans font-medium text-text-muted">Height (px)</label>
                    <Input type="number" value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary text-sm" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input type="checkbox" checked={maintainAspect} onChange={(e) => setMaintainAspect(e.target.checked)} className="accent-accent-primary" />
                  <span className="text-xs font-mono text-text-primary">Lock Aspect Ratio</span>
                </label>
                <div className="flex flex-col space-y-1.5">
                  <span className="text-xs font-sans font-medium text-text-muted">Quick Scale</span>
                  <div className="flex flex-wrap gap-2">
                    {[0.25, 0.5, 0.75, 1, 1.5, 2].map((s) => (
                      <button key={s} onClick={() => applyScale(s)}
                        className="text-xs bg-bg-panel border border-border-line px-2.5 py-1 rounded hover:border-accent-primary hover:text-accent-primary transition-colors font-mono">
                        {s === 1 ? "100%" : `${s * 100}%`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-bg-base p-5 border border-border-line rounded-xl flex flex-col space-y-3">
                <h3 className="text-xs font-bold font-mono text-accent-secondary uppercase tracking-widest border-b border-border-line pb-2">Presets</h3>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map((p) => (
                    <button key={p.label} onClick={() => applyPreset(p.w, p.h)}
                      className="text-xs bg-bg-panel border border-border-line rounded px-2 py-2 hover:border-accent-secondary hover:text-accent-secondary transition-colors font-mono text-center">
                      <div className="font-bold">{p.label}</div>
                      <div className="text-text-muted text-[10px]">{p.w}x{p.h}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button onClick={downloadResized}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold">
                  <Download size={18} /> Download Resized PNG
                </button>
                <button onClick={exportFaviconPack} disabled={exportingFavicons}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-colors font-mono text-sm disabled:opacity-50">
                  <Package size={16} />
                  {exportingFavicons ? "Exporting favicons..." : `Export Favicon Pack (${FAVICON_SIZES.join(", ")}px)`}
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}