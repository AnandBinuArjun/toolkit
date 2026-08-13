"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, FilePlus, Upload, Trash2, GripVertical } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: string;
}


export default function PdfMerger() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPdfs = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(),
        file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2) + " MB"
      }));
      setPdfs(prev => [...prev, ...newPdfs]);
    }
  };

  const removePdf = (id: string) => {
    setPdfs(pdfs.filter(p => p.id !== id));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const newPdfs = [...pdfs];
    [newPdfs[index - 1], newPdfs[index]] = [newPdfs[index], newPdfs[index - 1]];
    setPdfs(newPdfs);
  };

  const moveDown = (index: number) => {
    if (index === pdfs.length - 1) return;
    const newPdfs = [...pdfs];
    [newPdfs[index], newPdfs[index + 1]] = [newPdfs[index + 1], newPdfs[index]];
    setPdfs(newPdfs);
  };

  const mergePDFs = async () => {
    if (pdfs.length < 2) return;
    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfObj of pdfs) {
        const pdfBytes = await pdfObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged-document.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to merge PDFs. Ensure they are valid and not password-protected.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout id="pdf-merger" name="PDF Merger" description="Combine multiple PDF files into one. Processing happens entirely in your browser.">
      <div className="bg-bg-panel border border-border-line rounded-xl p-8 mb-8 text-center flex flex-col items-center">
        <Input 
          type="file" 
          multiple 
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
          Select PDF Files
        </button>
        <p className="mt-4 text-xs font-sans font-medium text-text-muted max-w-sm">
          Files never leave your device. All merging is performed locally.
        </p>
      </div>

      {pdfs.length > 0 && (
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
           <div className="px-4 py-3 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
             <span>{pdfs.length} Document(s) Ready to Merge</span>
           </div>
           
           <div className="divide-y divide-border-line">
             {pdfs.map((pdf, idx) => (
               <div key={pdf.id} className="p-4 flex items-center justify-between bg-bg-panel hover:bg-black/60 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1 text-faint">
                      <button onClick={() => moveUp(idx)} disabled={idx === 0} className="hover:text-white disabled:opacity-30">▲</button>
                      <button onClick={() => moveDown(idx)} disabled={idx === pdfs.length - 1} className="hover:text-white disabled:opacity-30">▼</button>
                    </div>
                    <div>
                      <div className="font-semibold text-white">{pdf.name}</div>
                      <div className="text-xs font-sans font-medium text-text-muted">{pdf.size}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => removePdf(pdf.id)}
                    className="p-2 text-accent-danger hover:bg-accent-danger/20 rounded transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
               </div>
             ))}
           </div>

           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-end">
              <button 
                onClick={mergePDFs}
                disabled={isProcessing || pdfs.length < 2}
                className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Merging..." : (
                  <>
                   <FileDown className="w-5 h-5" /> Merge & Download
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </ToolLayout>
  );
}