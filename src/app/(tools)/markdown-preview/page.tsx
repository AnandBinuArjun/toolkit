"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, Code, Eye } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { Textarea } from "@/components/ui/textarea";


export default function MarkdownPreviewPage() {
  const tool = TOOLS.find((t) => t.id === "markdown-preview")!;
  const [input, setInput] = useState("# Hello World\n\nThis is a **live** preview of your markdown.\n\n- Write markdown on the left.\n- See HTML output on the right.\n- Or view the raw HTML string.");
  const [htmlString, setHtmlString] = useState("");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  React.useEffect(() => {
    try {
      const rawHtml = marked.parse(input) as string;
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setHtmlString(cleanHtml);
    } catch (e) {
      console.error(e);
      setHtmlString("<p class='text-accent-danger'>Error parsing markdown.</p>");
    }
  }, [input]);

  const copyHtml = () => {
    navigator.clipboard.writeText(htmlString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[700px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
          {/* Input Side */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Markdown Input</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="Write some markdown here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Output Side */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex bg-bg-base border border-border-line rounded overflow-hidden">
                <button 
                  className={`px-3 py-1 flex items-center gap-2 text-xs font-mono ${viewMode === "preview" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                  onClick={() => setViewMode("preview")}
                >
                  <Eye size={14} /> Preview
                </button>
                <button 
                  className={`px-3 py-1 flex items-center gap-2 text-xs font-mono border-l border-border-line ${viewMode === "code" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
                  onClick={() => setViewMode("code")}
                >
                  <Code size={14} /> HTML
                </button>
              </div>

              <button 
                onClick={copyHtml}
                disabled={!htmlString}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy HTML
              </button>
            </div>
            
            <div className="flex-1 rounded-lg border border-border-line overflow-auto bg-white dark:bg-bg-panel">
              {viewMode === "preview" ? (
                <div 
                  className="prose prose-sm dark:prose-invert max-w-none p-4"
                  dangerouslySetInnerHTML={{ __html: htmlString }}
                />
              ) : (
                <Textarea
                  className="w-full h-full p-4 font-mono text-sm text-text-primary bg-transparent focus:outline-none resize-none"
                  value={htmlString}
                  readOnly
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}