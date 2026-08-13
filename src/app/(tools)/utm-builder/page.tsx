"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, ExternalLink, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";


export default function UtmBuilderPage() {
  const tool = TOOLS.find((t) => t.id === "utm-builder")!;
  
  const [baseUrl, setBaseUrl] = useState("https://tools.sivin.dev");
  const [source, setSource] = useState("newsletter");
  const [medium, setMedium] = useState("email");
  const [campaign, setCampaign] = useState("summer_sale");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  
  const [outputUrl, setOutputUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      if (!baseUrl) {
        setOutputUrl("");
        return;
      }
      
      let urlStr = baseUrl;
      if (!/^https?:\/\//i.test(urlStr)) {
        urlStr = "https://" + urlStr;
      }
      
      const url = new URL(urlStr);
      
      if (source) url.searchParams.set("utm_source", source);
      if (medium) url.searchParams.set("utm_medium", medium);
      if (campaign) url.searchParams.set("utm_campaign", campaign);
      if (term) url.searchParams.set("utm_term", term);
      if (content) url.searchParams.set("utm_content", content);
      
      setOutputUrl(url.toString());
    } catch (e) {
      setOutputUrl("Invalid Base URL");
    }
  }, [baseUrl, source, medium, campaign, term, content]);

  const copyToClipboard = () => {
    if (!outputUrl || outputUrl === "Invalid Base URL") return;
    navigator.clipboard.writeText(outputUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setBaseUrl("");
    setSource("");
    setMedium("");
    setCampaign("");
    setTerm("");
    setContent("");
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Output */}
        <div className="flex flex-col bg-bg-panel border-2 border-border-line rounded-xl overflow-hidden focus-within:border-accent-primary transition-colors">
          <div className="p-4 border-b border-border-line bg-bg-base flex items-center justify-between">
            <span className="text-xs font-sans font-medium text-text-muted">Generated Campaign URL</span>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearForm}
                className="text-xs flex items-center gap-1 px-3 py-1.5 bg-bg-panel border border-border-line rounded text-text-muted hover:text-accent-danger transition-colors font-mono"
              >
                <RefreshCw size={14} /> Reset
              </button>
              <button 
                onClick={copyToClipboard}
                disabled={!outputUrl || outputUrl === "Invalid Base URL"}
                className="text-xs flex items-center gap-1 px-4 py-1.5 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy URL
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className={`font-mono text-sm break-all ${outputUrl === "Invalid Base URL" ? "text-accent-danger" : "text-text-primary"}`}>
              {outputUrl || "Enter parameters below to build the URL..."}
            </div>
            {outputUrl && outputUrl !== "Invalid Base URL" && (
              <a 
                href={outputUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-xs font-mono text-accent-secondary hover:underline"
              >
                Test Link <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Builder Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="flex flex-col space-y-6">
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-text-primary">Website URL <span className="text-accent-danger">*</span></label>
              <span className="text-xs font-sans font-medium text-text-muted">The full website URL (e.g. https://www.example.com/page)</span>
              <Input 
                type="text" 
                value={baseUrl} 
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-3 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
              <label className="text-sm font-bold text-text-primary">Campaign Source (utm_source) <span className="text-accent-danger">*</span></label>
              <span className="text-xs font-sans font-medium text-text-muted">The referrer (e.g. google, newsletter, twitter)</span>
              <Input 
                type="text" 
                value={source} 
                onChange={(e) => setSource(e.target.value)}
                placeholder="google"
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-text-primary">Campaign Medium (utm_medium) <span className="text-accent-danger">*</span></label>
              <span className="text-xs font-sans font-medium text-text-muted">Marketing medium (e.g. cpc, banner, email)</span>
              <Input 
                type="text" 
                value={medium} 
                onChange={(e) => setMedium(e.target.value)}
                placeholder="cpc"
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-text-primary">Campaign Name (utm_campaign) <span className="text-accent-danger">*</span></label>
              <span className="text-xs font-sans font-medium text-text-muted">Product, promo code, or slogan (e.g. spring_sale)</span>
              <Input 
                type="text" 
                value={campaign} 
                onChange={(e) => setCampaign(e.target.value)}
                placeholder="spring_sale"
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
          </div>

          <div className="flex flex-col space-y-6 pt-0 md:pt-24">
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-text-primary">Campaign Term (utm_term)</label>
              <span className="text-xs font-sans font-medium text-text-muted">Identify the paid keywords</span>
              <Input 
                type="text" 
                value={term} 
                onChange={(e) => setTerm(e.target.value)}
                placeholder="running+shoes"
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-bold text-text-primary">Campaign Content (utm_content)</label>
              <span className="text-xs font-sans font-medium text-text-muted">Use to differentiate ads (e.g. logolink or textlink)</span>
              <Input 
                type="text" 
                value={content} 
                onChange={(e) => setContent(e.target.value)}
                placeholder="logolink"
                className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
              />
            </div>

            <div className="bg-accent-secondary/10 border border-accent-secondary/30 p-4 rounded-xl mt-8">
              <h4 className="text-sm font-bold text-accent-secondary mb-2 flex items-center gap-2">
                Why use UTM parameters?
              </h4>
              <p className="text-xs text-text-muted font-mono leading-relaxed">
                UTM (Urchin Tracking Module) parameters are tags you add to a URL. 
                When your link is clicked, the tags are sent back to Google Analytics (and other analytics platforms) and track the effectiveness of your campaign.
              </p>
            </div>
            
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}