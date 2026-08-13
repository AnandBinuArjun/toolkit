"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, Expand, Upload } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";


export default function PdfResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"A4" | "Letter">("A4");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PAGE_SIZES = {
    A4: { width: 595.28, height: 841.89 },
    Letter: { width: 612, height: 792 }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const resizePDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const bytes = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(bytes);
      const newPdf = await PDFDocument.create();

      const targetSize = PAGE_SIZES[format];
      const pageIndices = originalPdf.getPageIndices();
      
      // We must embed the pages of the original PDF into the new one to scale them
      const embeddedPages = await newPdf.embedPdf(originalPdf, pageIndices);

      for (const embeddedPage of embeddedPages) {
        const page = newPdf.addPage([targetSize.width, targetSize.height]);
        
        // Calculate scale to fit within target
        const scale = Math.min(
          targetSize.width / embeddedPage.width,
          targetSize.height / embeddedPage.height
        );

        const scaledWidth = embeddedPage.width * scale;
        const scaledHeight = embeddedPage.height * scale;

        // Center on page
        const x = (targetSize.width - scaledWidth) / 2;
        const y = (targetSize.height - scaledHeight) / 2;

        page.drawPage(embeddedPage, {
          x,
          y,
          width: scaledWidth,
          height: scaledHeight,
        });
      }

      const newPdfBytes = await newPdf.save();
      const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resized-${format}-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to resize PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout id="pdf-page-resizer" name="PDF Page Resizer" description="Scale your PDF pages to standard sizes (A4, Letter) while maintaining aspect ratio.">
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
           </div>
           
           <div className="p-8">
             <label className="block text-sm font-sans font-medium text-text-muted mb-2 uppercase">Target Format</label>
             <select
               className="w-full bg-bg-panel border border-border-line rounded-lg p-4 text-white outline-none focus:border-accent-primary font-mono appearance-none"
               value={format}
               onChange={e => setFormat(e.target.value as "A4" | "Letter")}
             >
               <option value="A4">A4 (210 x 297 mm)</option>
               <option value="Letter">US Letter (8.5 x 11 in)</option>
             </select>
           </div>

           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-between items-center">
              <button 
                onClick={() => setFile(null)}
                className="text-text-muted hover:text-white transition-colors px-4 py-2"
              >
                Start Over
              </button>
              <button 
                onClick={resizePDF}
                disabled={isProcessing}
                className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : (
                  <>
                   <FileDown className="w-5 h-5" /> Resize & Download
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </ToolLayout>
  );
}