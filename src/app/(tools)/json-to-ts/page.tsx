"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Trash2, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function JsonToTsPage() {
  const tool = TOOLS.find((t) => t.id === "json-to-ts")!;
  
  const [jsonInput, setJsonInput] = useState('{\n  "id": 1,\n  "name": "Leanne Graham",\n  "username": "Bret",\n  "email": "Sincere@april.biz",\n  "address": {\n    "street": "Kulas Light",\n    "suite": "Apt. 556",\n    "city": "Gwenborough",\n    "zipcode": "92998-3874",\n    "geo": {\n      "lat": "-37.3159",\n      "lng": "81.1496"\n    }\n  },\n  "phone": "1-770-736-8031 x56442",\n  "website": "hildegard.org",\n  "company": {\n    "name": "Romaguera-Crona",\n    "catchPhrase": "Multi-layered client-server neural-net",\n    "bs": "harness real-time e-markets"\n  }\n}');
  const [rootName, setRootName] = useState("RootObject");
  const [tsOutput, setTsOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateTypeScriptInterfaces = (jsonString: string, root: string) => {
    try {
      const obj = JSON.parse(jsonString);
      
      const interfaces: Record<string, string[]> = {};
      
      const getType = (value: any, keyName: string): string => {
        if (value === null) return 'null';
        if (Array.isArray(value)) {
          if (value.length === 0) return 'any[]';
          const type = getType(value[0], keyName);
          return type.includes('|') || type === 'any' ? `(${type})[]` : `${type}[]`;
        }
        if (typeof value === 'object') {
          const interfaceName = keyName.charAt(0).toUpperCase() + keyName.slice(1);
          parseObject(value, interfaceName);
          return interfaceName;
        }
        return typeof value;
      };

      const parseObject = (object: any, name: string) => {
        if (!interfaces[name]) {
          interfaces[name] = [];
        }
        
        for (const key in object) {
          const type = getType(object[key], key);
          const formattedKey = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(key) ? key : `"${key}"`;
          // Prevent duplicates in case of array of objects where we parse multiple times (simplified here to just use first element above)
          const field = `  ${formattedKey}: ${type};`;
          if (!interfaces[name].includes(field)) {
            interfaces[name].push(field);
          }
        }
      };

      if (Array.isArray(obj)) {
        if (obj.length > 0) {
          parseObject(obj[0], root);
        } else {
          return `type ${root} = any[];`;
        }
      } else {
        parseObject(obj, root);
      }

      let result = "";
      for (const [name, fields] of Object.entries(interfaces)) {
        result += `export interface ${name} {\n${fields.join('\n')}\n}\n\n`;
      }

      setError(null);
      return result.trim();
    } catch (e) {
      setError("Invalid JSON");
      return "";
    }
  };

  useEffect(() => {
    if (!jsonInput.trim()) {
      setTsOutput("");
      setError(null);
      return;
    }
    const output = generateTypeScriptInterfaces(jsonInput, rootName || "RootObject");
    setTsOutput(output);
  }, [jsonInput, rootName]);

  const copyToClipboard = () => {
    if (!tsOutput) return;
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-base p-4 border border-border-line rounded-lg">
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-xs font-sans font-medium text-text-muted">Root Interface Name:</label>
            <Input 
              type="text" 
              value={rootName} 
              onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="RootObject"
              className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
            />
          </div>
          {error && <span className="text-sm font-mono text-accent-danger">{error}</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[600px]">
          
          {/* JSON Input */}
          <div className="flex flex-col h-full border border-border-line rounded-xl bg-bg-panel overflow-hidden focus-within:border-accent-primary transition-colors">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center">
              <span className="text-xs font-sans font-medium text-text-muted">JSON Source</span>
              <button 
                onClick={() => setJsonInput("")}
                className="text-xs flex items-center gap-1 text-text-muted hover:text-accent-danger transition-colors"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <Textarea
              className="flex-1 w-full p-4 font-mono text-sm text-text-primary bg-transparent focus:outline-none resize-none"
              placeholder="Paste JSON here..."
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* TS Output */}
          <div className="flex flex-col h-full border border-border-line rounded-xl bg-bg-panel overflow-hidden">
            <div className="p-3 border-b border-border-line bg-bg-base flex justify-between items-center">
              <span className="text-xs font-sans font-medium text-text-muted flex items-center gap-2">
                <ArrowRight size={14} className="text-accent-secondary hidden md:block" />
                TypeScript Interfaces
              </span>
              <button 
                onClick={copyToClipboard}
                disabled={!tsOutput}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-secondary/20 border border-accent-secondary rounded text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-sans font-medium disabled:opacity-50"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy Code
              </button>
            </div>
            <Textarea
              className="flex-1 w-full p-4 font-mono text-sm text-accent-secondary bg-transparent focus:outline-none resize-none selection:bg-accent-secondary selection:text-black"
              value={tsOutput}
              readOnly
              placeholder="TypeScript interfaces will be generated here..."
              spellCheck={false}
            />
          </div>

        </div>

      </div>
    </ToolLayout>
  );
}