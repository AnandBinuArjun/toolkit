"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { FileDown, LockOpen, Upload, KeyRound } from "lucide-react";
import { PDFDocument } from "pdf-lib";
import { Input } from "@/components/ui/input";


export default function PdfPassword() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorMsg("");
    }
  };

  const unlockPDF = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg("");
    try {
      const bytes = await file.arrayBuffer();
      // Load the PDF with the provided password
      const doc = await PDFDocument.load(bytes, { password } as any);
      
      // Saving it again will save it without encryption by default in pdf-lib
      const newPdfBytes = await doc.save();
      
      const blob = new Blob([newPdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `unlocked-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      console.error(e);
      if (e.message?.includes("password")) {
        setErrorMsg("Incorrect password or the PDF uses unsupported encryption.");
      } else {
        setErrorMsg("Failed to unlock PDF. It might be corrupted.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout id="pdf-password-remover" name="PDF Password Remover" description="Remove the password from an encrypted PDF. (You must know the current password).">
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
            Select Locked PDF
          </button>
        </div>
      ) : (
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden mb-8">
           <div className="px-4 py-3 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
             <span>{file.name}</span>
           </div>
           
           <div className="p-8 max-w-md mx-auto">
             <label className="block text-sm font-sans font-medium text-text-muted mb-2 uppercase text-center">Current Password</label>
             <div className="relative">
               <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
               <Input
                 type="password"
                 className="w-full bg-bg-panel border border-border-line rounded-lg p-4 pl-10 text-white outline-none focus:border-accent-primary font-mono text-center"
                 placeholder="Enter password..."
                 value={password}
                 onChange={e => setPassword(e.target.value)}
               />
             </div>
             {errorMsg && (
                <p className="mt-4 text-accent-danger text-sm text-center font-mono">{errorMsg}</p>
             )}
           </div>

           <div className="p-4 border-t border-border-line bg-bg-panel flex justify-between items-center">
              <button 
                onClick={() => { setFile(null); setPassword(""); setErrorMsg(""); }}
                className="text-text-muted hover:text-white transition-colors px-4 py-2"
              >
                Start Over
              </button>
              <button 
                onClick={unlockPDF}
                disabled={isProcessing || !password}
                className="bg-accent-primary text-black font-bold px-6 py-3 rounded-lg hover:bg-accent-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? "Processing..." : (
                  <>
                   <FileDown className="w-5 h-5" /> Unlock & Download
                  </>
                )}
              </button>
           </div>
        </div>
      )}
    </ToolLayout>
  );
}