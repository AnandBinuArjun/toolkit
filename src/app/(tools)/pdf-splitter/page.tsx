"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, Scissors, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";


export default function PdfSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [range, setRange] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      setFile(selected);
      try {
        const bytes = await selected.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        setPageCount(doc.getPageCount());
        setRange(`1-${doc.getPageCount()}`);
      } catch (e) {
        alert("Could not load PDF. It might be password protected or corrupted.");
        setFile(null);
      }
    }
  };

  const splitPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      // Parse range string (e.g., "1-3, 5, 7-9")
      const pagesToExtract = new Set<number>();
      const parts = range.split(",");
      for (let part of parts) {
        part = part.trim();
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-");
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end) && start <= end) {
            for (let i = start; i <= end; i++) pagesToExtract.add(i);
          }
        } else {
          const num = parseInt(part, 10);
          if (!isNaN(num)) pagesToExtract.add(num);
        }
      }

      const indices = Array.from(pagesToExtract)
        .map(p => p - 1)
        .filter(i => i >= 0 && i < pageCount)
        .sort((a, b) => a - b);

      if (indices.length === 0) {
        alert("No valid pages selected.");
        setIsProcessing(false);
        return;
      }

      const bytes = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(originalPdf, indices);
      copiedPages.forEach(page => newPdf.addPage(page));

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `split-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to split PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout id="pdf-splitter" name="PDF Splitter" description="Extract specific pages from a PDF. Processing happens entirely in your browser.">
      {!file ? (
        <div className="bg-bg-panel border border-border-line rounded-xl p-8 mb-8 text-center flex flex-col items-center">
          <Input 
            type="file" 
            accept="application/pdf" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-accent-primary/20 text-accent-primary border border-accent-primary px-6 py-3 rounded-lg hover:bg-accent-primary hover:text-black transition-colors flex items-center gap-2"
          >
            <Upload className="w-5 h-5" />
            Select PDF File
          </button>
        </div>
      ) : (
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
           <div className="px-4 py-3 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
             <span>{file.name}</span>
             <span>{pageCount} Pages</span>
           </div>
           
           <div className="p-8">
             <label className="block text-sm font-sans font-medium text-text-muted mb-2 uppercase">Pages to Extract</label>
             <Input
               type="text"
               className="w-full bg-bg-panel border border-border-line rounded-lg p-4 text-white outline-none focus:border-accent-primary font-mono"
               placeholder="e.g. 1-3, 5, 7"
               value={range}
               onChange={e => setRange(e.target.value)}
             />
             <p className="mt-2 text-xs text-faint">
               Use commas to separate pages or dashes for ranges. E.g., <strong>1-3, 5, 8-10</strong>.
             </p>
           </div>

           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-between items-center">
              <button 
                onClick={() => setFile(null)}
                className="text-text-muted hover:text-white transition-colors px-4 py-2"
              >
                Start Over
              </button>
              <button 
                onClick={splitPDF}
                disabled={isProcessing || !range}
                className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : (
                  <>
                   <FileDown className="w-5 h-5" /> Extract & Download
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </ToolLayout>
  );
}