"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function MetaTagGeneratorPage() {
  const tool = TOOLS.find((t) => t.id === "meta-tag-generator")!;
  
  const [title, setTitle] = useState("ToolKit - 50+ Web Tools");
  const [description, setDescription] = useState("A collection of 50+ client-side tools for developers, designers, and creators.");
  const [keywords, setKeywords] = useState("tools, dev, design, product, web");
  const [author, setAuthor] = useState("Anand Binu Arjun");
  const [url, setUrl] = useState("https://tools.abarjun.online");
  const [imageUrl, setImageUrl] = useState("https://tools.abarjun.online/og-image.png");
  const [twitterHandle, setTwitterHandle] = useState("@AnandBinuArjun");
  const [themeColor, setThemeColor] = useState("#000000");

  const [copied, setCopied] = useState(false);

  const generateMetaTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">
${keywords ? `<meta name="keywords" content="${keywords}">` : ''}
${author ? `<meta name="author" content="${author}">` : ''}
${themeColor ? `<meta name="theme-color" content="${themeColor}">` : ''}

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
${imageUrl ? `<meta property="og:image" content="${imageUrl}">` : ''}

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
${imageUrl ? `<meta property="twitter:image" content="${imageUrl}">` : ''}
${twitterHandle ? `<meta name="twitter:creator" content="${twitterHandle}">` : ''}`;
  };

  const metaOutput = generateMetaTags();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(metaOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setUrl("");
    setImageUrl("");
    setTwitterHandle("");
    setThemeColor("#ffffff");
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Form */}
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center bg-bg-base p-4 border border-border-line rounded-lg">
              <span className="text-sm font-bold font-mono text-text-primary">Site Information</span>
              <button onClick={clearForm} className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors font-mono">
                <RefreshCw size={14} /> Clear All
              </button>
            </div>

            <div className="flex flex-col space-y-4 bg-bg-base p-6 border border-border-line rounded-xl">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Site Title (Recommended &lt; 60 chars)</label>
                <Input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={70}
                  className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
                <span className="text-[10px] text-text-muted text-right">{title.length}/70</span>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Site Description (Recommended &lt; 160 chars)</label>
                <Textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={200}
                  className="w-full h-24 bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary resize-none"
                />
                <span className="text-[10px] text-text-muted text-right">{description.length}/200</span>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Canonical URL</label>
                <Input 
                  type="text" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://"
                  className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>

            </div>

            <div className="flex flex-col space-y-4 bg-bg-base p-6 border border-border-line rounded-xl">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-sans font-medium text-text-muted">Keywords (Comma separated)</label>
                  <Input 
                    type="text" 
                    value={keywords} 
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-sans font-medium text-text-muted">Author</label>
                  <Input 
                    type="text" 
                    value={author} 
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-sans font-medium text-text-muted">OG Image URL (1200x630)</label>
                  <Input 
                    type="text" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-sans font-medium text-text-muted">Twitter Handle (w/ @)</label>
                  <Input 
                    type="text" 
                    value={twitterHandle} 
                    onChange={(e) => setTwitterHandle(e.target.value)}
                    className="w-full bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Theme Color</label>
                <div className="flex items-center gap-2 bg-bg-panel border border-border-line rounded px-2 py-1 max-w-[200px]">
                  <Input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0" />
                  <Input type="text" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-full bg-transparent font-mono text-sm focus:outline-none" />
                </div>
              </div>

            </div>

          </div>

          {/* Output */}
          <div className="flex flex-col h-full border border-border-line rounded-xl bg-bg-panel overflow-hidden">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center sticky top-0 backdrop-blur-md z-10">
              <span className="text-xs font-sans font-medium text-text-muted">&lt;head&gt; tags</span>
              <button 
                onClick={copyToClipboard}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy HTML
              </button>
            </div>
            <Textarea
              className="flex-1 w-full p-4 font-mono text-xs sm:text-sm text-text-primary bg-transparent focus:outline-none resize-none selection:bg-accent-primary selection:text-black min-h-[500px]"
              value={metaOutput.trim()}
              readOnly
              spellCheck={false}
            />
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}