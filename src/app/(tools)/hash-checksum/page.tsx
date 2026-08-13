"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, FileText } from "lucide-react";
import CryptoJS from "crypto-js";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function HashChecksumPage() {
  const tool = TOOLS.find((t) => t.id === "hash-checksum")!;
  const [input, setInput] = useState("");
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});
  const [hashes, setHashes] = useState({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: ""
  });
  const [mode, setMode] = useState<"text" | "file">("text");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileProgress, setFileProgress] = useState(0);

  // Text Hashing
  useEffect(() => {
    if (mode === "text") {
      if (!input) {
        setHashes({ md5: "", sha1: "", sha256: "", sha512: "" });
        return;
      }
      setHashes({
        md5: CryptoJS.MD5(input).toString(),
        sha1: CryptoJS.SHA1(input).toString(),
        sha256: CryptoJS.SHA256(input).toString(),
        sha512: CryptoJS.SHA512(input).toString()
      });
    }
  }, [input, mode]);

  // File Hashing (simulated chunking for UI responsiveness on small files)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMode("file");
    setFileName(file.name);
    setFileProgress(0);
    setHashes({ md5: "Calculating...", sha1: "Calculating...", sha256: "Calculating...", sha512: "Calculating..." });

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result as ArrayBuffer;
      const wordArr = CryptoJS.lib.WordArray.create(arrayBuffer as any);
      
      setHashes({
        md5: CryptoJS.MD5(wordArr).toString(),
        sha1: CryptoJS.SHA1(wordArr).toString(),
        sha256: CryptoJS.SHA256(wordArr).toString(),
        sha512: CryptoJS.SHA512(wordArr).toString()
      });
      setFileProgress(100);
    };
    reader.readAsArrayBuffer(file);
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text || text === "Calculating...") return;
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const HashRow = ({ label, value, id }: { label: string; value: string; id: string }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-border-line last:border-0 hover:bg-bg-base transition-colors gap-4">
      <span className="text-xs font-sans font-medium text-accent-primary w-16 shrink-0">{label}</span>
      <span className="text-sm font-mono text-text-primary break-all flex-1">{value}</span>
      <button 
        onClick={() => copyToClipboard(value, id)}
        disabled={!value || value === "Calculating..."}
        className="self-end md:self-auto p-2 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        title="Copy"
      >
        {copiedMap[id] ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">
        
        {/* Toggle Mode */}
        <div className="flex bg-bg-base border border-border-line rounded overflow-hidden self-start">
          <button 
            className={`px-6 py-2 text-sm font-mono ${mode === "text" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
            onClick={() => setMode("text")}
          >
            Text Input
          </button>
          <button 
            className={`px-6 py-2 text-sm font-mono border-l border-border-line ${mode === "file" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
            onClick={() => setMode("file")}
          >
            File Upload
          </button>
        </div>

        {mode === "text" ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input String</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="w-full h-32 bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Enter text to hash..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-border-line rounded-lg bg-bg-base hover:border-accent-primary transition-colors cursor-pointer relative overflow-hidden group">
            <Input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={handleFileUpload}
            />
            <FileText size={48} className="text-text-muted mb-4 group-hover:text-accent-primary transition-colors" />
            <span className="font-mono text-sm text-text-primary group-hover:text-accent-primary transition-colors">
              {fileName ? fileName : "Click or drag file to calculate hashes"}
            </span>
            <span className="text-xs font-sans font-medium text-text-muted mt-2">
              Files are processed locally in your browser. (Max recommended: 50MB)
            </span>
            
            {fileProgress > 0 && fileProgress < 100 && (
              <div className="absolute bottom-0 left-0 h-1 bg-accent-primary transition-all duration-300" style={{ width: `${fileProgress}%` }}></div>
            )}
          </div>
        )}

        {/* Results */}
        <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden">
          <div className="p-3 border-b border-border-line bg-bg-base">
            <span className="text-xs font-sans font-medium text-text-muted">Calculated Hashes</span>
          </div>
          <div className="flex flex-col">
            <HashRow label="MD5" value={hashes.md5} id="md5" />
            <HashRow label="SHA-1" value={hashes.sha1} id="sha1" />
            <HashRow label="SHA-256" value={hashes.sha256} id="sha256" />
            <HashRow label="SHA-512" value={hashes.sha512} id="sha512" />
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}