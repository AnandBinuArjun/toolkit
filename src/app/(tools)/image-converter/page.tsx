"use client";

import React, { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Download, UploadCloud, X, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";

type OutputFormat = "image/webp" | "image/jpeg" | "image/png";

interface ConvertedFile {
  name: string;
  originalSize: number;
  convertedSize: number;
  dataUrl: string;
  format: OutputFormat;
}

const FORMAT_LABELS: Record<OutputFormat, string> = {
  "image/webp": "WEBP",
  "image/jpeg": "JPEG",
  "image/png": "PNG",
};

const FORMAT_EXT: Record<OutputFormat, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}


export default function ImageConverterPage() {
  const tool = TOOLS.find((t) => t.id === "image-converter")!;

  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<OutputFormat>("image/webp");
  const [quality, setQuality] = useState(85);
  const [converted, setConverted] = useState<ConvertedFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const addFiles = (newFiles: FileList | File[]) => {
    const arr = Array.from(newFiles).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...arr.filter((f) => !existing.has(f.name + f.size))];
    });
    setConverted([]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setConverted([]);
  };

  const convertAll = useCallback(async () => {
    if (!files.length || !canvasRef.current) return;
    setConverting(true);
    const results: ConvertedFile[] = [];

    for (const file of files) {
      const dataUrl = await new Promise<string>((res) => {
        const reader = new FileReader();
        reader.onload = (e) => res(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const outputUrl = await new Promise<string>((res) => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current!;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          if (format === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, img.width, img.height);
          } else {
            ctx.clearRect(0, 0, img.width, img.height);
          }
          ctx.drawImage(img, 0, 0);
          res(canvas.toDataURL(format, quality / 100));
        };
        img.src = dataUrl;
      });

      const base64 = outputUrl.split(",")[1];
      const outputBytes = Math.round((base64.length * 3) / 4);

      results.push({
        name: file.name.replace(/\.[^.]+$/, "") + "." + FORMAT_EXT[format],
        originalSize: file.size,
        convertedSize: outputBytes,
        dataUrl: outputUrl,
        format,
      });
    }

    setConverted(results);
    setConverting(false);
  }, [files, format, quality]);

  const downloadAll = () => {
    converted.forEach((c, i) => {
      setTimeout(() => {
        const a = document.createElement("a");
        a.download = c.name;
        a.href = c.dataUrl;
        a.click();
      }, i * 150);
    });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const savings = converted.reduce((acc, c) => acc + (c.originalSize - c.convertedSize), 0);
  const totalOriginal = converted.reduce((acc, c) => acc + c.originalSize, 0);
  const savingsPct = totalOriginal > 0 ? Math.round((savings / totalOriginal) * 100) : 0;

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        <canvas ref={canvasRef} className="hidden" />

        {/* Settings Bar */}
        <div className="flex flex-wrap items-end gap-6 p-5 bg-bg-base border border-border-line rounded-xl">
          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-sans font-medium text-text-muted uppercase tracking-widest">Output Format</label>
            <div className="flex gap-2">
              {(["image/webp", "image/jpeg", "image/png"] as OutputFormat[]).map((f) => (
                <button key={f} onClick={() => { setFormat(f); setConverted([]); }}
                  className={`px-4 py-2 rounded border font-mono text-sm font-bold transition-colors ${format === f ? "bg-accent-primary/20 border-accent-primary text-accent-primary" : "border-border-line text-text-muted hover:border-accent-primary/50 hover:text-text-primary"}`}>
                  {FORMAT_LABELS[f]}
                </button>
              ))}
            </div>
          </div>

          {format !== "image/png" && (
            <div className="flex flex-col space-y-1.5 flex-1 min-w-[180px]">
              <label className="text-xs font-sans font-medium text-text-muted uppercase tracking-widest flex justify-between">
                <span>Quality</span><span className="text-accent-primary">{quality}%</span>
              </label>
              <Input type="range" min="1" max="100" value={quality}
                onChange={(e) => { setQuality(parseInt(e.target.value)); setConverted([]); }}
                className="accent-accent-primary" />
              <div className="flex justify-between text-[10px] font-sans font-medium text-text-muted">
                <span>Smallest</span><span>Balanced</span><span>Best Quality</span>
              </div>
            </div>
          )}
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-2xl transition-colors cursor-pointer ${dragging ? "border-accent-primary bg-accent-primary/10" : "border-border-line bg-bg-base hover:border-accent-primary/50 hover:bg-black/30"}`}>
          <Input type="file" accept="image/*" multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <UploadCloud size={40} className={`mb-4 transition-colors ${dragging ? "text-accent-primary" : "text-text-muted"}`} />
          <p className="font-sans font-semibold text-text-primary">Drop images here or click to browse</p>
          <p className="text-xs font-sans font-medium text-text-muted mt-1">PNG, JPG, WEBP, GIF, AVIF � multiple files supported</p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-sans font-medium text-text-muted uppercase tracking-widest">{files.length} file{files.length > 1 ? "s" : ""} queued</span>
              <button onClick={() => { setFiles([]); setConverted([]); }}
                className="text-xs font-sans font-medium text-text-muted hover:text-accent-danger transition-colors">Clear all</button>
            </div>
            {files.map((f, i) => {
              const result = converted[i];
              return (
                <div key={i} className="flex items-center gap-3 px-4 py-3 bg-bg-panel border border-border-line rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm text-text-primary truncate">{f.name}</div>
                    <div className="text-xs font-sans font-medium text-text-muted">{formatBytes(f.size)}</div>
                  </div>
                  {result && (
                    <div className="text-right text-xs font-mono">
                      <div className="text-accent-secondary">{formatBytes(result.convertedSize)}</div>
                      <div className={result.convertedSize < f.size ? "text-accent-primary" : "text-text-muted"}>
                        {result.convertedSize < f.size ? `-${Math.round(((f.size - result.convertedSize) / f.size) * 100)}%` : "no change"}
                      </div>
                    </div>
                  )}
                  <button onClick={() => removeFile(i)} className="text-text-muted hover:text-accent-danger transition-colors ml-2">
                    <X size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Savings Summary */}
        {converted.length > 0 && savingsPct > 0 && (
          <div className="flex items-center gap-4 p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-xl">
            <div className="text-2xl font-bold font-sans font-medium text-accent-primary">{savingsPct}%</div>
            <div>
              <div className="text-sm font-mono text-text-primary font-bold">Saved {formatBytes(savings)} total</div>
              <div className="text-xs font-sans font-medium text-text-muted">{formatBytes(totalOriginal)} ? {formatBytes(totalOriginal - savings)}</div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {files.length > 0 && (
          <div className="flex gap-3">
            <button onClick={convertAll} disabled={converting}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold disabled:opacity-50">
              {converting ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              {converting ? "Converting..." : `Convert to ${FORMAT_LABELS[format]}`}
            </button>
            {converted.length > 0 && (
              <button onClick={downloadAll}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-semibold">
                <Download size={18} /> Download All
              </button>
            )}
          </div>
        )}

        {files.length === 0 && (
          <div className="text-center text-text-muted text-sm font-mono p-8 border border-dashed border-border-line rounded-xl">
            Add images above to convert them between formats locally.<br />
            <span className="text-accent-secondary opacity-70 text-xs">Everything runs in your browser � no uploads, no servers.</span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}