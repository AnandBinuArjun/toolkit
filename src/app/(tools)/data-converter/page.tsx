"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, ArrowRight } from "lucide-react";
import * as yaml from "js-yaml";
import toml from "@iarna/toml";
import Papa from "papaparse";
import { Textarea } from "@/components/ui/textarea";

type Format = "json" | "yaml" | "toml" | "csv";


export default function DataConverterPage() {
  const tool = TOOLS.find((t) => t.id === "data-converter")!;
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fromFormat, setFromFormat] = useState<Format>("json");
  const [toFormat, setToFormat] = useState<Format>("yaml");

  const convertData = () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }

    try {
      // 1. Parse input into a JS object
      let parsedObj: any;
      
      switch (fromFormat) {
        case "json":
          parsedObj = JSON.parse(input);
          break;
        case "yaml":
          parsedObj = yaml.load(input);
          break;
        case "toml":
          parsedObj = toml.parse(input);
          break;
        case "csv":
          const parsedCsv = Papa.parse(input, { header: true, dynamicTyping: true, skipEmptyLines: true });
          if (parsedCsv.errors.length > 0) {
            throw new Error(`CSV Error: ${parsedCsv.errors[0].message}`);
          }
          parsedObj = parsedCsv.data;
          break;
      }

      if (parsedObj === undefined || parsedObj === null) {
        throw new Error("Parsed object is empty");
      }

      // 2. Serialize JS object to target format
      let resultString = "";
      
      switch (toFormat) {
        case "json":
          resultString = JSON.stringify(parsedObj, null, 2);
          break;
        case "yaml":
          resultString = yaml.dump(parsedObj);
          break;
        case "toml":
          // TOML requires root object to be a dictionary, not array
          if (Array.isArray(parsedObj)) {
            resultString = toml.stringify({ data: parsedObj });
          } else {
            resultString = toml.stringify(parsedObj);
          }
          break;
        case "csv":
          // Papa.unparse requires an array of objects
          const dataToUnparse = Array.isArray(parsedObj) ? parsedObj : [parsedObj];
          resultString = Papa.unparse(dataToUnparse);
          break;
      }

      setOutput(resultString);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(`Failed to convert ${fromFormat.toUpperCase()} to ${toFormat.toUpperCase()}`);
      }
    }
  };

  React.useEffect(() => {
    convertData();
  }, [input, fromFormat, toFormat]);

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const swapFormats = () => {
    setFromFormat(toFormat);
    setToFormat(fromFormat);
    setInput(output);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4 h-[600px]">
        <div className="flex flex-wrap items-center gap-4 p-4 border border-border-line rounded-lg bg-bg-base">
          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-medium text-text-muted">From:</span>
            <select 
              className="bg-bg-panel border border-border-line rounded px-2 py-1 text-sm font-mono uppercase text-text-primary focus:outline-none focus:border-accent-primary"
              value={fromFormat}
              onChange={(e) => setFromFormat(e.target.value as Format)}
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="toml">TOML</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <button 
            onClick={swapFormats}
            className="p-1.5 rounded hover:bg-bg-panel border border-border-line text-text-muted hover:text-accent-primary transition-colors"
            title="Swap"
          >
            <ArrowRight size={14} />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-sans font-medium text-text-muted">To:</span>
            <select 
              className="bg-bg-panel border border-border-line rounded px-2 py-1 text-sm font-mono uppercase text-text-primary focus:outline-none focus:border-accent-primary"
              value={toFormat}
              onChange={(e) => setToFormat(e.target.value as Format)}
            >
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="toml">TOML</option>
              <option value="csv">CSV</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 h-full">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input ({fromFormat.toUpperCase()})</span>
              <button 
                onClick={() => setInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder={`Paste your ${fromFormat.toUpperCase()} here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Output ({toFormat.toUpperCase()})</span>
              <button 
                onClick={copyToClipboard}
                disabled={!output || !!error}
                className="text-xs flex items-center gap-1 px-2 py-1 bg-bg-base border border-border-line rounded hover:border-accent-secondary hover:text-accent-secondary transition-all font-mono disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            
            <div className="flex-1 relative rounded-lg border border-border-line overflow-hidden bg-bg-panel">
              {error ? (
                <div className="absolute inset-0 p-4 text-accent-danger font-mono text-sm overflow-auto whitespace-pre-wrap">
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