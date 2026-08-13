"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function UrlParserPage() {
  const tool = TOOLS.find((t) => t.id === "url-parser")!;
  
  const [urlInput, setUrlInput] = useState("https://user:pass@tools.abarjun.online:443/category/tools?search=query&page=1#section2");
  const [parsed, setParsed] = useState<URL | null>(null);
  const [params, setParams] = useState<{ key: string; value: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!urlInput.trim()) {
      setParsed(null);
      setParams([]);
      setError(null);
      return;
    }
    
    try {
      // Add a dummy protocol if missing so we can still parse it somewhat
      let urlToParse = urlInput;
      if (!/^https?:\/\//i.test(urlToParse) && !/^([a-z0-9-]+):/i.test(urlToParse)) {
        urlToParse = "https://" + urlToParse;
      }
      
      const u = new URL(urlToParse);
      setParsed(u);
      
      const p: { key: string; value: string }[] = [];
      u.searchParams.forEach((val, key) => p.push({ key, value: val }));
      setParams(p);
      setError(null);
    } catch (e) {
      setParsed(null);
      setParams([]);
      setError("Invalid URL format");
    }
  }, [urlInput]);

  const copyToClipboard = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const PartRow = ({ label, value, id }: { label: string; value: string; id: string }) => {
    if (!value) return null;
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border-b border-border-line last:border-0 hover:bg-bg-base transition-colors gap-4">
        <span className="text-xs font-sans font-medium text-accent-primary w-24 shrink-0 uppercase tracking-wider">{label}</span>
        <span className="text-sm font-mono text-text-primary break-all flex-1">{value}</span>
        <button 
          onClick={() => copyToClipboard(value, id)}
          className="self-end md:self-auto p-2 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-secondary hover:border-accent-secondary transition-colors"
          title="Copy"
        >
          {copiedMap[id] ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    );
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Input */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-medium text-text-muted">Target URL</span>
            <button 
              onClick={() => setUrlInput("")}
              className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          <div className="relative">
            <Textarea
              className={`w-full h-24 bg-bg-panel border-2 rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none transition-colors resize-none ${error ? 'border-accent-danger' : 'border-border-line focus:border-accent-primary'}`}
              placeholder="Paste URL here to parse..."
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              spellCheck={false}
            />
            {error && <span className="absolute bottom-4 right-4 text-xs font-mono text-accent-danger bg-bg-base px-2 py-1 rounded">{error}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Main Parts */}
          <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden h-fit">
            <div className="p-3 border-b border-border-line bg-bg-base">
              <span className="text-xs font-sans font-medium text-text-muted">URL Components</span>
            </div>
            {parsed ? (
              <div className="flex flex-col">
                <PartRow label="Protocol" value={parsed.protocol.replace(':', '')} id="protocol" />
                <PartRow label="Username" value={parsed.username} id="username" />
                <PartRow label="Password" value={parsed.password} id="password" />
                <PartRow label="Host" value={parsed.hostname} id="host" />
                <PartRow label="Port" value={parsed.port || (parsed.protocol === 'https:' ? '443' : parsed.protocol === 'http:' ? '80' : '')} id="port" />
                <PartRow label="Origin" value={parsed.origin !== 'null' ? parsed.origin : ''} id="origin" />
                <PartRow label="Pathname" value={parsed.pathname} id="pathname" />
                <PartRow label="Hash" value={parsed.hash} id="hash" />
              </div>
            ) : (
              <div className="p-12 text-center text-text-muted text-sm font-mono border-t border-transparent">
                Waiting for valid URL...
              </div>
            )}
          </div>

          {/* Query Params */}
          <div className="border border-border-line rounded-lg bg-bg-panel overflow-hidden h-fit">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center">
              <span className="text-xs font-sans font-medium text-text-muted">Query Parameters</span>
              <span className="text-xs font-mono text-accent-secondary bg-accent-secondary/20 px-2 rounded">
                {params.length} Params
              </span>
            </div>
            {params.length > 0 ? (
              <div className="flex flex-col p-4 gap-2 bg-bg-base">
                {params.map((p, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-2 bg-bg-panel border border-border-line rounded p-2">
                    <Input 
                      type="text" 
                      readOnly 
                      value={p.key} 
                      className="bg-bg-panel border border-border-line rounded px-2 py-1 font-mono text-sm text-accent-secondary focus:outline-none flex-1"
                    />
                    <Input 
                      type="text" 
                      readOnly 
                      value={p.value} 
                      className="bg-bg-panel border border-border-line rounded px-2 py-1 font-mono text-sm text-text-primary focus:outline-none flex-[2]"
                    />
                    <button 
                      onClick={() => copyToClipboard(p.value, `param_${i}`)}
                      className="p-2 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-primary transition-colors flex shrink-0 items-center justify-center"
                      title="Copy Value"
                    >
                      {copiedMap[`param_${i}`] ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-text-muted text-sm font-mono border-t border-transparent">
                No query parameters found.
              </div>
            )}
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}