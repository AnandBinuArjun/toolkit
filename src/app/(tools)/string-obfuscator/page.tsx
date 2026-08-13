"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function StringObfuscatorPage() {
  const tool = TOOLS.find((t) => t.id === "string-obfuscator")!;
  
  const [input, setInput] = useState("Hello World! This is a secret message.");
  const [method, setMethod] = useState<"rot13" | "zeroWidth" | "reverse" | "hex">("rot13");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);

  // ZWCs mapped to binary
  const zeroWidthMap = {
    '0': '\u200B', // Zero width space
    '1': '\u200C', // Zero width non-joiner
    ' ': '\u200D', // Zero width joiner (separator)
  };
  
  const reverseZeroWidthMap = {
    '\u200B': '0',
    '\u200C': '1',
    '\u200D': ' ',
  };

  const rot13 = (str: string) => {
    return str.replace(/[a-zA-Z]/g, (c) => {
      const base = c <= 'Z' ? 65 : 97;
      return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
    });
  };

  const toZeroWidth = (str: string) => {
    return str.split('').map(char => {
      const bin = char.charCodeAt(0).toString(2);
      return bin.split('').map(b => zeroWidthMap[b as keyof typeof zeroWidthMap]).join('');
    }).join(zeroWidthMap[' ']);
  };

  const fromZeroWidth = (str: string) => {
    try {
      const chars = str.split(zeroWidthMap[' ']);
      return chars.map(char => {
        const bin = char.split('').map(b => reverseZeroWidthMap[b as keyof typeof reverseZeroWidthMap]).join('');
        return String.fromCharCode(parseInt(bin, 2));
      }).join('');
    } catch {
      return "Invalid Zero-Width string";
    }
  };

  const toHex = (str: string) => {
    return str.split('').map(c => '\\x' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  };

  const fromHex = (str: string) => {
    try {
      return str.replace(/\\x([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
    } catch {
      return "Invalid Hex string";
    }
  };

  useEffect(() => {
    if (!input) {
      setOutput("");
      return;
    }

    let result = "";
    
    if (method === "rot13") {
      // ROT13 is symmetric, encoding is decoding
      result = rot13(input);
    } else if (method === "reverse") {
      result = input.split('').reverse().join('');
    } else if (method === "zeroWidth") {
      result = isDecoding ? fromZeroWidth(input) : toZeroWidth(input) + " [Hidden characters injected]";
      if (!isDecoding) {
        // If encoding to ZWC, we need to hide it in some normal text, or just output the raw ZWCs. 
        // We will output them directly, but append a note so they aren't completely invisible in the UI.
        // Actually, just prepending a visible string is best for testing.
        result = "VisibleText" + toZeroWidth(input);
      } else {
        // Find the ZWC block inside the string
        const regex = new RegExp(`[${zeroWidthMap['0']}${zeroWidthMap['1']}${zeroWidthMap[' ']}]`, 'g');
        const zwcs = input.match(regex);
        if (zwcs) {
          result = fromZeroWidth(zwcs.join(''));
        } else {
          result = "No hidden Zero-Width string found.";
        }
      }
    } else if (method === "hex") {
      result = isDecoding ? fromHex(input) : toHex(input);
    }

    setOutput(result);
  }, [input, method, isDecoding]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-bg-base p-4 border border-border-line rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-sans font-medium text-text-muted mr-2">Method:</span>
            <select
              className="bg-bg-panel border border-border-line rounded px-4 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
            >
              <option value="rot13">ROT13 Cipher</option>
              <option value="zeroWidth">Zero-Width Steganography</option>
              <option value="hex">Hexadecimal Escape (\x00)</option>
              <option value="reverse">Reverse String</option>
            </select>
          </div>
          <button 
            onClick={() => setIsDecoding(!isDecoding)}
            className={`flex items-center justify-center gap-2 px-4 py-2 border rounded font-mono text-sm transition-colors ${isDecoding ? 'bg-accent-secondary/20 border-accent-secondary text-accent-secondary' : 'bg-accent-primary/20 border-accent-primary text-accent-primary'}`}
          >
            <ArrowRightLeft size={16} /> {isDecoding ? "Mode: Decode" : "Mode: Encode"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Input */}
          <div className="flex flex-col">
            <div className="flex justify-between mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Input</span>
              <span className="text-xs font-sans font-medium text-text-muted">{input.length} chars</span>
            </div>
            <Textarea
              className="w-full h-64 bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none"
              placeholder={`Enter text to ${isDecoding ? 'decode' : 'encode'}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-sans font-medium text-text-muted">Output</span>
              <button 
                onClick={copyToClipboard}
                disabled={!output}
                className="text-xs flex items-center gap-1 px-3 py-1 bg-accent-primary/20 border border-accent-primary rounded text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-medium disabled:opacity-50"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />} Copy
              </button>
            </div>
            <Textarea
              className="w-full h-64 bg-bg-base border border-border-line rounded-lg p-4 font-mono text-sm text-text-primary focus:outline-none transition-colors resize-none break-all"
              value={output}
              readOnly
              placeholder="Output will appear here..."
              spellCheck={false}
            />
          </div>

        </div>

        {method === "zeroWidth" && (
          <div className="bg-accent-primary/10 border border-accent-primary/30 p-4 rounded-xl mt-8">
            <h4 className="text-sm font-bold text-accent-primary mb-2 flex items-center gap-2">
              What is Zero-Width Steganography?
            </h4>
            <p className="text-xs text-text-muted font-mono leading-relaxed">
              It converts your text into invisible characters (U+200B, U+200C, U+200D) and hides them inside a normal string. 
              You can copy the output and paste it anywhere, and it will look like normal text, but the hidden data remains intact. 
              Switch to "Decode" mode and paste the text containing hidden characters to reveal the secret message.
            </p>
          </div>
        )}

      </div>
    </ToolLayout>
  );
}