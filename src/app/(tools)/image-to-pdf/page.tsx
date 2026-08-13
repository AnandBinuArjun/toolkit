"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, FileImage, Upload, Trash2, GripVertical } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}


export default function ImageToPdf() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => ({
        id: Math.random().toString(),
        file,
        preview: URL.createObjectURL(file)
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  // Simple drag-and-drop reordering could be added here, but omitted for simplicity
  // Instead we'll just allow removal and re-adding.

  const generatePDF = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgObj of images) {
        const imageBytes = await imgObj.file.arrayBuffer();
        let pdfImage;
        if (imgObj.file.type === 'image/jpeg' || imgObj.file.type === 'image/jpg') {
          pdfImage = await pdfDoc.embedJpg(imageBytes);
        } else if (imgObj.file.type === 'image/png') {
          pdfImage = await pdfDoc.embedPng(imageBytes);
        } else {
            console.warn("Unsupported image type:", imgObj.file.type);
            continue; // Skip unsupported
        }

        const dims = pdfImage.scale(1);
        const page = pdfDoc.addPage([dims.width, dims.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: dims.width,
          height: dims.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "images-converted.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert("Failed to generate PDF. Make sure images are valid PNG or JPG.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout id="image-to-pdf" name="Image to PDF" description="Convert multiple PNG or JPG images into a single PDF document entirely in your browser.">
      <div className="bg-bg-panel border border-border-line rounded-xl p-8 mb-8 text-center">
        <Input 
          type="file" 
          multiple 
          accept="image/png, image/jpeg, image/jpg" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleFileChange}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-accent-primary/20 text-accent-primary border border-accent-primary px-6 py-3 rounded-lg hover:bg-accent-primary hover:text-black transition-colors flex items-center gap-2 mx-auto"
        >
          <Upload className="w-5 h-5" />
          Select Images (PNG, JPG)
        </button>
      </div>

      {images.length > 0 && (
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
           <div className="px-4 py-3 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
             <span>{images.length} Image(s) Added</span>
           </div>
           <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
             {images.map((img, idx) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border-line bg-bg-panel aspect-[3/4]">
                   <img src={img.preview} alt={`Preview ${idx+1}`} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => removeImage(img.id)}
                       className="p-2 bg-accent-danger text-white rounded-full hover:scale-110 transition-transform"
                     >
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                   <div className="absolute top-2 left-2 bg-black/80 text-white text-xs font-mono px-2 py-1 rounded">
                     {idx + 1}
                   </div>
                </div>
             ))}
           </div>
           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-end">
              <button 
                onClick={generatePDF}
                disabled={isProcessing}
                className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : (
                  <>
                   <FileDown className="w-5 h-5" /> Download PDF
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </ToolLayout>
  );
}