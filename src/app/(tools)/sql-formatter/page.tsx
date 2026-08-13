"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2 } from "lucide-react";
import { format } from "sql-formatter";
import { Textarea } from "@/components/ui/textarea";


export default function SqlFormatterPage() {
  const tool = TOOLS.find((t) => t.id === "sql-formatter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [dialect, setDialect] = useState<string>("sql");
  const [status, setStatus] = useState<"READY" | "PROCESSING">("READY");

  const formatSql = () => {
    setStatus("PROCESSING");
    setError(null);
    try {
      if (!input.trim()) {
        setOutput("");
        setStatus("READY");
        return;
      }
      
      // We are ignoring types here just to support dynamic dialects
      // since sql-formatter v15 changed how dialects are exported
      const formatted = format(input, {
        language: dialect as any,
        tabWidth: 2,
        keywordCase: "upper",
        linesBetweenQueries: 2,
      });
      setOutput(formatted);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Invalid SQL syntax");
      }
    } finally {
      setStatus("READY");
    }
  };

  React.useEffect(() => {
    formatSql();
  }, [input, dialect]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description} status={status}>
      <div className="flex flex-col space-y-4 h-[600px]">
        <div className="flex items-center gap-4 p-4 border border-border-line rounded-lg bg-bg-base">
          <span className="text-xs font-sans font-medium text-text-muted">Dialect:</span>
          <select 
            className="bg-bg-panel border border-border-line rounded px-2 py-1 text-sm font-mono text-text-primary focus:outline-none focus:border-accent-primary"
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
          >
            <option value="sql">Standard SQL</option>
            <option value="postgresql">PostgreSQL</option>
            <option value="mysql">MySQL</option>
            <option value="mariadb">MariaDB</option>
            <option value="sqlite">SQLite</option>
            <option value="tsql">T-SQL (SQL Server)</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder="SELECT * FROM users WHERE id = 1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Output</span>
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            
            <div className="flex-1 relative rounded-lg border border-border-line overflow-hidden bg-bg-panel">
              {error ? (
                <div className="absolute inset-0 p-4 text-accent-danger font-mono text-sm overflow-auto">
                  {error}
                </div>
              ) : (
                <Textarea
                  className="w-full h-full p-4 font-mono text-sm text-text-primary bg-transparent focus:outline-none resize-none"
                  value={output}
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