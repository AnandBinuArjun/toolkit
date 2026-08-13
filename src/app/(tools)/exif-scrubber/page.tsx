"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { ImageOff, Upload, Download } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function ExifScrubber() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [scrubbedUrl, setScrubbedUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setScrubbedUrl("");
    }
  };

  const scrubImage = () => {
    if (!file || !preview) return;
    setIsProcessing(true);
    
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
          alert("Canvas not supported.");
          setIsProcessing(false);
          return;
      }
      
      // Drawing onto a canvas and extracting inherently strips EXIF metadata
      ctx.drawImage(img, 0, 0);
      
      // Maintain original type if possible, fallback to png
      const mimeType = file.type === "image/jpeg" ? "image/jpeg" : "image/png";
      const quality = mimeType === "image/jpeg" ? 0.95 : undefined;
      
      const dataUrl = canvas.toDataURL(mimeType, quality);
      setScrubbedUrl(dataUrl);
      setIsProcessing(false);
    };
    img.onerror = () => {
      alert("Failed to load image for scrubbing.");
      setIsProcessing(false);
    }
    img.src = preview;
  };

  return (
    <ToolLayout id="exif-metadata-scrubber" name="EXIF & Metadata Scrubber" description="Remove hidden GPS coordinates, camera details, and EXIF metadata from images before sharing.">
      {!file ? (
        <div className="bg-bg-panel border border-border-line rounded-xl p-8 mb-8 text-center flex flex-col items-center">
          <Input 
            type="file" 
            accept="image/jpeg, image/png, image/webp" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-accent-primary/20 text-accent-primary border border-accent-primary px-6 py-3 rounded-lg hover:bg-accent-primary hover:text-black transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Select Image
          </button>
          <p className="mt-4 text-xs font-sans font-medium text-text-muted max-w-sm">
            Everything runs in your browser. Images are never uploaded to any server.
          </p>
        </div>
      ) : (
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
           <div className="px-4 py-3 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
             <span>{file.name} ({(file.size / 1024).toFixed(2)} KB)</span>
           </div>
           
           <div className="p-8 flex justify-center bg-bg-panel">
              <img src={preview} alt="Preview" className="max-h-[400px] object-contain rounded border border-border-line" />
           </div>

           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setPreview(""); setScrubbedUrl(""); }}
                className="text-text-muted hover:text-white transition-colors px-4 py-2"
              >
                Clear
              </button>
              
              {!scrubbedUrl ? (
                <button 
                  onClick={scrubImage}
                  disabled={isProcessing}
                  className="bg-accent-danger/20 text-accent-danger border border-accent-danger font-bold px-6 py-3 rounded-lg hover:bg-accent-danger hover:text-white transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? "Scrubbing..." : "Scrub Metadata"}
                </button>
              ) : (
                <a 
                  href={scrubbedUrl}
                  download={`clean-${file.name}`}
                  className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2"
                >
                  <Download className="w-5 h-5" /> Download Clean Image
                </a>
              )}
           </div>
        </div>
      )}
    </ToolLayout>
  );
}