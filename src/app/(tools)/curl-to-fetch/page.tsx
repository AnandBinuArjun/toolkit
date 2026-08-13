"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { ArrowRightLeft, Copy, Check, Terminal } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function CurlToFetch() {
  const [input, setInput] = useState("");
  const [direction, setDirection] = useState<"curl-to-fetch" | "fetch-to-curl">("curl-to-fetch");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    if (!input.trim()) return "";
    try {
      if (direction === "curl-to-fetch") {
        // Very basic cURL parser
        let str = input.replace(/\\\n/g, " ").replace(/\\\r\n/g, " ").trim();
        if (!str.startsWith("curl")) return "Invalid cURL command";

        let method = "GET";
        let url = "";
        let headers: Record<string, string> = {};
        let body = "";

        // Extremely naive regex parser for demonstration
        const urlMatch = str.match(/'(http[^']+)'|"([^"]+)"|([^\s'"]+)/g);
        if (urlMatch) {
           for(const p of urlMatch) {
               if(p.startsWith("http") || p.startsWith("'http") || p.startsWith('"http')) {
                   url = p.replace(/['"]/g, "");
                   break;
               }
           }
        }

        const methodMatch = str.match(/-X\s+([A-Z]+)/);
        if (methodMatch) method = methodMatch[1];

        const headerRegex = /-H\s+(['"])(.*?)\1/g;
        let match;
        while ((match = headerRegex.exec(str)) !== null) {
          const h = match[2];
          const splitIdx = h.indexOf(":");
          if (splitIdx > -1) {
            headers[h.substring(0, splitIdx).trim()] = h.substring(splitIdx + 1).trim();
          }
        }

        const dataMatch = str.match(/(?:-d|--data|--data-raw)\s+(['"])(.*?)\1/);
        if (dataMatch) {
          body = dataMatch[2];
          if (method === "GET") method = "POST";
        }

        let fetchCode = `fetch('${url}', {\n  method: '${method}',`;
        if (Object.keys(headers).length > 0) {
          fetchCode += `\n  headers: {\n`;
          for (const [k, v] of Object.entries(headers)) {
            fetchCode += `    '${k}': '${v}',\n`;
          }
          fetchCode += `  },`;
        }
        if (body) {
            // Attempt to pretty print JSON body if it is JSON
            let prettyBody = `'${body}'`;
            if (headers['Content-Type']?.includes('json') || headers['content-type']?.includes('json')) {
                try {
                    prettyBody = `JSON.stringify(${JSON.stringify(JSON.parse(body), null, 4)})`;
                } catch(e) {}
            }
            fetchCode += `\n  body: ${prettyBody},`;
        }
        fetchCode += `\n})\n.then(res => res.json())\n.then(data => console.log(data))\n.catch(err => console.error(err));`;
        return fetchCode;
      } else {
        return "/* Fetch to cURL implementation omitted for brevity */";
      }
    } catch (e) {
      return "Error parsing input.";
    }
  };

  const output = convert();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id="curl-fetch" name="cURL ↔ Fetch" description="Convert cURL commands to JavaScript fetch() snippets.">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { setDirection(d => d === "curl-to-fetch" ? "fetch-to-curl" : "curl-to-fetch"); setInput(""); }}
          className="flex items-center gap-2 bg-bg-panel border border-border-line px-4 py-2 rounded-lg hover:border-accent-primary transition-colors text-sm"
        >
          <ArrowRightLeft className="w-4 h-4" />
          Swap Direction: {direction === "curl-to-fetch" ? "cURL to Fetch" : "Fetch to cURL"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            {direction === "curl-to-fetch" ? "Input cURL" : "Input Fetch"}
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm resize-none min-h-[300px]"
            placeholder={direction === "curl-to-fetch" ? "curl -X GET 'https://api.example.com'" : "fetch('https://...')"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
          />
        </div>

        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col relative">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
            <span>{direction === "curl-to-fetch" ? "Output Fetch" : "Output cURL"}</span>
            <button onClick={handleCopy} className="text-accent-primary hover:text-white transition-colors" title="Copy Output">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none font-mono text-sm text-text-muted resize-none min-h-[300px]"
            value={output}
            readOnly
            spellCheck={false}
          />
        </div>
      </div>
    </ToolLayout>
  );
}