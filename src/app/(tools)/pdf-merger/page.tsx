"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, FilePlus, Upload, Trash2, GripVertical } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: string;
}

function SortableItem(props: { id: string; pdf: PdfFile; onRemove: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id });
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition,
    zIndex: isDragging ? 10 : 1,
    position: "relative" as const
  };
  
  return (
    <div ref={setNodeRef} style={style} className={`p-4 flex items-center justify-between bg-bg-panel hover:bg-black/60 transition-colors ${isDragging ? 'opacity-50 shadow-lg' : ''}`}>
      <div className="flex items-center gap-4">
        <button 
          {...attributes} 
          {...listeners} 
          className="text-text-muted hover:text-white cursor-grab active:cursor-grabbing p-2 -ml-2 touch-none"
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <div>
          <div className="font-semibold text-white truncate max-w-[200px] md:max-w-md">{props.pdf.name}</div>
          <div className="text-xs font-sans font-medium text-text-muted">{props.pdf.size}</div>
        </div>
      </div>
      <button 
        onClick={() => props.onRemove(props.id)}
        className="p-2 text-accent-danger hover:bg-accent-danger/20 rounded transition-colors"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </div>
  );
}

export default function PdfMerger() {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPdfs((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
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
           
           <DndContext 
             sensors={sensors}
             collisionDetection={closestCenter}
             onDragEnd={handleDragEnd}
           >
             <SortableContext 
               items={pdfs.map(p => p.id)}
               strategy={verticalListSortingStrategy}
             >
               <div className="divide-y divide-border-line">
                 {pdfs.map((pdf) => (
                   <SortableItem key={pdf.id} id={pdf.id} pdf={pdf} onRemove={removePdf} />
                 ))}
               </div>
             </SortableContext>
           </DndContext>

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