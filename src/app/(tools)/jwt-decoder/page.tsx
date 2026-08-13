"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function JwtDecoderPage() {
  const tool = TOOLS.find((t) => t.id === "jwt-decoder")!;
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const [copiedHeader, setCopiedHeader] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  React.useEffect(() => {
    setError(null);
    if (!input.trim()) {
      setHeader("");
      setPayload("");
      return;
    }

    try {
      const parts = input.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format. Expected 3 parts separated by dots.");
      }

      // Base64Url decode function
      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const pad = base64.length % 4;
        if (pad) {
          if (pad === 1) throw new Error("Invalid base64 string");
          base64 += new Array(5 - pad).join("=");
        }
        return decodeURIComponent(escape(atob(base64)));
      };

      const decodedHeader = decodeBase64Url(parts[0]);
      const decodedPayload = decodeBase64Url(parts[1]);

      // Pretty print JSON if possible
      setHeader(JSON.stringify(JSON.parse(decodedHeader), null, 2));
      setPayload(JSON.stringify(JSON.parse(decodedPayload), null, 2));

    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Failed to decode JWT");
      }
      setHeader("");
      setPayload("");
    }
  }, [input]);

  const copyToClipboard = (text: string, isHeader: boolean) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isHeader) {
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } else {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4">
        
        {/* Warning Banner */}
        <div className="bg-accent-warn/10 border border-accent-warn rounded-lg p-4 text-sm text-accent-warn flex items-start gap-2">
          <span className="font-bold shrink-0">[LOCAL ONLY]</span>
          <p>
            Tokens are decoded entirely in your browser. This tool does not verify the signature, it only decodes the Base64Url payloads. Do not share sensitive tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Input Side */}
          <div className="flex flex-col h-[600px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Encoded JWT</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none break-all"
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
            {error && (
              <div className="mt-2 text-xs font-mono text-accent-danger">
                {error}
              </div>
            )}
          </div>

          {/* Output Side */}
          <div className="flex flex-col h-[600px] space-y-4">
            
            {/* Header */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-medium text-text-muted">Header (Algorithm & Type)</span>
                <button 
                  onClick={() => copyToClipboard(header, true)}
                  disabled={!header}
                  className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedHeader ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <Textarea
                className="flex-1 w-full p-4 rounded-lg border border-border-line bg-bg-panel font-mono text-sm text-text-primary focus:outline-none resize-none"
                value={header}
                readOnly
                placeholder="{}"
              />
            </div>

            {/* Payload */}
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-sans font-medium text-text-muted">Payload (Data)</span>
                <button 
                  onClick={() => copyToClipboard(payload, false)}
                  disabled={!payload}
                  className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {copiedPayload ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <Textarea
                className="flex-1 w-full p-4 rounded-lg border border-border-line bg-bg-panel font-mono text-sm text-text-primary focus:outline-none resize-none"
                value={payload}
                readOnly
                placeholder="{}"
              />
            </div>

          </div>
        </div>
      </div>
    </ToolLayout>
  );
}