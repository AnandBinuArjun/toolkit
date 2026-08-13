"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, KeySquare, RefreshCw, ShieldCheck } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function RsaKeyGeneratorPage() {
  const tool = TOOLS.find((t) => t.id === "rsa-key-generator")!;
  
  const [keySize, setKeySize] = useState<1024 | 2048 | 4096>(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const addNewLines = (str: string) => {
    const result = [];
    for (let i = 0; i < str.length; i += 64) {
      result.push(str.substring(i, i + 64));
    }
    return result.join('\n');
  };

  const generateKeys = async () => {
    if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
      alert("Web Crypto API is not supported in your browser.");
      return;
    }

    setIsGenerating(true);
    setPublicKey("");
    setPrivateKey("");
    
    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]), // 65537
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );

      // Export Public Key (SPKI)
      const spki = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
      const spkiB64 = arrayBufferToBase64(spki);
      const pubPem = `-----BEGIN PUBLIC KEY-----\n${addNewLines(spkiB64)}\n-----END PUBLIC KEY-----`;

      // Export Private Key (PKCS8)
      const pkcs8 = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      const pkcs8B64 = arrayBufferToBase64(pkcs8);
      const privPem = `-----BEGIN PRIVATE KEY-----\n${addNewLines(pkcs8B64)}\n-----END PRIVATE KEY-----`;

      setPublicKey(pubPem);
      setPrivateKey(privPem);
    } catch (error) {
      console.error("Error generating keys:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 max-w-5xl mx-auto">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-bg-base p-6 border border-border-line rounded-xl">
          
          <div className="flex flex-col space-y-2 w-full md:w-auto">
            <label className="text-xs font-sans font-medium text-text-muted">Key Size (Modulus Length)</label>
            <div className="flex bg-bg-base border border-border-line rounded overflow-hidden">
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono ${keySize === 1024 ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setKeySize(1024)}
              >
                1024-bit
              </button>
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono border-l border-r border-border-line ${keySize === 2048 ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setKeySize(2048)}
              >
                2048-bit
              </button>
              <button 
                className={`flex-1 px-4 py-2 text-sm font-mono ${keySize === 4096 ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                onClick={() => setKeySize(4096)}
              >
                4096-bit
              </button>
            </div>
            <span className="text-[10px] text-text-muted font-mono max-w-[300px]">
              2048-bit is the current standard. 4096-bit provides more security but takes longer to generate and process.
            </span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-3">
            <button 
              onClick={generateKeys}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 px-8 py-3 bg-accent-primary/20 border border-accent-primary rounded-lg text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <KeySquare size={18} />} 
              {isGenerating ? "Generating..." : "Generate Key Pair"}
            </button>
            <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-600">
              <ShieldCheck size={12} /> 100% Local (Web Crypto API)
            </div>
          </div>

        </div>

        {/* Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Public Key */}
          <div className="flex flex-col border border-border-line rounded-xl bg-bg-panel overflow-hidden">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
              <span className="text-xs font-sans font-medium text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-primary"></span>
                Public Key (SPKI / PEM)
              </span>
              <button 
                onClick={() => copyToClipboard(publicKey, 'pub')}
                disabled={!publicKey}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-medium disabled:opacity-50"
              >
                {copiedMap['pub'] ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            <Textarea
              className="flex-1 w-full h-[400px] p-4 font-mono text-[10px] sm:text-xs text-text-primary bg-transparent focus:outline-none resize-none selection:bg-accent-primary selection:text-black break-all"
              value={publicKey}
              readOnly
              placeholder="Public key will appear here..."
              spellCheck={false}
            />
          </div>

          {/* Private Key */}
          <div className="flex flex-col border border-border-line rounded-xl bg-bg-panel overflow-hidden relative">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
              <span className="text-xs font-sans font-medium text-text-muted flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-danger"></span>
                Private Key (PKCS#8 / PEM)
              </span>
              <button 
                onClick={() => copyToClipboard(privateKey, 'priv')}
                disabled={!privateKey}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-danger/20 border border-accent-danger rounded text-accent-danger hover:bg-accent-danger hover:text-black transition-colors font-sans font-medium disabled:opacity-50"
              >
                {copiedMap['priv'] ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            <Textarea
              className="flex-1 w-full h-[400px] p-4 font-mono text-[10px] sm:text-xs text-text-muted bg-transparent focus:outline-none resize-none selection:bg-accent-danger selection:text-black break-all relative z-0"
              value={privateKey}
              readOnly
              placeholder="Private key will appear here..."
              spellCheck={false}
            />
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}