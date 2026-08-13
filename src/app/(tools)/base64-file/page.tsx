"use client";

import React, { useState, useRef } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { UploadCloud, Copy, Check, File, FileText, Image as ImageIcon, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function Base64FilePage() {
  const tool = TOOLS.find((t) => t.id === "base64-file")!;
  
  const [file, setFile] = useState<File | null>(null);
  const [base64Str, setBase64Str] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setLoading(true);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setBase64Str(event.target?.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const copyToClipboard = () => {
    if (!base64Str) return;
    navigator.clipboard.writeText(base64Str);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearFile = () => {
    setFile(null);
    setBase64Str("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <ImageIcon size={48} className="text-accent-secondary" />;
    if (type.startsWith("text/")) return <FileText size={48} className="text-accent-primary" />;
    return <File size={48} className="text-text-muted" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {!file ? (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-border-line rounded-2xl bg-bg-base hover:border-accent-primary hover:bg-bg-panel transition-colors cursor-pointer relative group">
            <Input 
              type="file" 
              ref={fileInputRef}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
            <UploadCloud size={64} className="text-text-muted mb-6 group-hover:text-accent-primary transition-colors" />
            <h3 className="text-xl font-bold font-mono text-text-primary mb-2 group-hover:text-accent-primary transition-colors">Select or drop a file</h3>
            <p className="text-text-muted text-sm font-mono max-w-md text-center">Convert images, PDFs, fonts, or any file into a Base64 encoded Data URI string. Everything happens in your browser.</p>
          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            
            {/* File Info Card */}
            <div className="flex items-center justify-between p-6 bg-bg-panel border border-border-line rounded-xl">
              <div className="flex items-center gap-6">
                {getFileIcon(file.type)}
                <div className="flex flex-col">
                  <span className="font-bold text-text-primary font-mono text-lg truncate max-w-[200px] md:max-w-md">{file.name}</span>
                  <div className="flex items-center gap-4 mt-1 text-xs font-sans font-medium text-text-muted">
                    <span>{formatSize(file.size)}</span>
                    <span className="bg-bg-panel px-2 py-0.5 rounded">{file.type || 'unknown type'}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={clearFile}
                className="p-3 bg-bg-panel border border-border-line rounded-lg text-text-muted hover:text-accent-danger hover:border-accent-danger transition-colors"
                title="Remove File"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Output */}
            <div className="flex flex-col border border-border-line rounded-xl bg-bg-panel overflow-hidden relative">
              <div className="p-4 border-b border-border-line bg-bg-base flex justify-between items-center sticky top-0 z-10 backdrop-blur-md">
                <div className="flex flex-col">
                  <span className="text-sm font-bold font-sans font-medium text-accent-primary">Base64 Data URI</span>
                  <span className="text-xs text-text-muted font-mono mt-0.5">Ready to use in src="" or url()</span>
                </div>
                <button 
                  onClick={copyToClipboard}
                  disabled={loading || !base64Str}
                  className="text-xs flex items-center gap-2 px-4 py-2 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold disabled:opacity-50"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied!" : "Copy Base64"}
                </button>
              </div>
              
              <div className="p-6 overflow-auto max-h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center p-12 text-accent-primary font-mono animate-pulse">
                    Encoding file...
                  </div>
                ) : (
                  <pre className="font-mono text-xs text-text-primary whitespace-pre-wrap break-all selection:bg-accent-primary selection:text-black">
                    {base64Str}
                  </pre>
                )}
              </div>
            </div>

            {/* If it's an image, show preview */}
            {file.type.startsWith("image/") && base64Str && (
              <div className="flex flex-col p-6 bg-bg-base border border-border-line rounded-xl mt-4">
                <span className="text-xs font-sans font-medium text-text-muted mb-4">Image Preview</span>
                <div className="flex items-center justify-center bg-[url('/checkers.png')] p-8 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-bg-base" style={{ backgroundImage: "linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px" }} />
                  <img src={base64Str} alt="Preview" className="max-w-full max-h-[300px] object-contain relative z-10 shadow-2xl" />
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </ToolLayout>
  );
}