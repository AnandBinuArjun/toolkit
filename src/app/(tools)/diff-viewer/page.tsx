"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { diffLines, Change } from "diff";
import { Textarea } from "@/components/ui/textarea";


export default function DiffViewerPage() {
  const tool = TOOLS.find((t) => t.id === "diff-viewer")!;
  const [oldText, setOldText] = useState("Hello World\nThis is a line to be changed.\nThis line will be deleted.\nThis line stays.");
  const [newText, setNewText] = useState("Hello World\nThis is a changed line.\nThis line stays.\nThis is a new line.");
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [viewMode, setViewMode] = useState<"edit" | "diff">("edit");

  React.useEffect(() => {
    if (viewMode === "diff") {
      const diff = diffLines(oldText, newText);
      setDiffResult(diff);
    }
  }, [oldText, newText, viewMode]);

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[700px]">
        
        {/* Toggle Mode */}
        <div className="flex justify-center border-b border-border-line pb-4">
          <div className="flex bg-bg-base border border-border-line rounded overflow-hidden">
            <button 
              className={`px-6 py-2 text-sm font-mono ${viewMode === "edit" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
              onClick={() => setViewMode("edit")}
            >
              1. Enter Text
            </button>
            <button 
              className={`px-6 py-2 text-sm font-mono border-l border-border-line ${viewMode === "diff" ? "bg-accent-primary/20 text-accent-primary" : "text-text-muted hover:bg-bg-panel"}`}
              onClick={() => setViewMode("diff")}
            >
              2. View Diff
            </button>
          </div>
        </div>

        {/* Edit Mode */}
        {viewMode === "edit" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
            <div className="flex flex-col h-full">
              <label className="text-xs font-sans font-medium text-text-muted mb-2">Original Text</label>
              <Textarea
                className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
                placeholder="Paste original text here..."
                value={oldText}
                onChange={(e) => setOldText(e.target.value)}
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col h-full">
              <label className="text-xs font-sans font-medium text-text-muted mb-2">Modified Text</label>
              <Textarea
                className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
                placeholder="Paste modified text here..."
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Diff Mode */}
        {viewMode === "diff" && (
          <div className="flex-1 rounded-lg border border-border-line overflow-auto bg-bg-panel font-mono text-sm">
            <div className="p-4 whitespace-pre-wrap break-words">
              {diffResult.map((part, index) => {
                let bgColor = "";
                let textColor = "text-text-primary";
                let prefix = "  ";

                if (part.added) {
                  bgColor = "bg-green-500/20";
                  textColor = "text-emerald-600";
                  prefix = "+ ";
                } else if (part.removed) {
                  bgColor = "bg-red-500/20";
                  textColor = "text-rose-600";
                  prefix = "- ";
                }

                // Add the prefix to each line within the part
                const lines = part.value.split('\n');
                // The last element is empty if the string ended with a newline
                if (lines[lines.length - 1] === '') {
                  lines.pop();
                }

                return lines.map((line, lineIndex) => (
                  <div key={`${index}-${lineIndex}`} className={`px-2 py-0.5 ${bgColor} ${textColor}`}>
                    <span className="opacity-50 select-none mr-2 inline-block w-4">{prefix}</span>
                    <span>{line}</span>
                  </div>
                ));
              })}
            </div>
            {diffResult.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                No differences found. The texts are identical.
              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}