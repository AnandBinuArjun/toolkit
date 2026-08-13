"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function IdGeneratorPage() {
  const tool = TOOLS.find((t) => t.id === "id-generator")!;
  const [uuid, setUuid] = useState(crypto.randomUUID());
  const [password, setPassword] = useState("");
  const [copiedUuid, setCopiedUuid] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  // Password Options
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const generateUuid = () => setUuid(crypto.randomUUID());

  const generatePassword = () => {
    let chars = "";
    if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (!chars) {
      setPassword("Please select at least one character set.");
      return;
    }

    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
    setPassword(result);
  };

  React.useEffect(() => {
    generatePassword();
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  const copyToClipboard = (text: string, isUuid: boolean) => {
    navigator.clipboard.writeText(text);
    if (isUuid) {
      setCopiedUuid(true);
      setTimeout(() => setCopiedUuid(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* UUID Generator */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-lg font-bold text-accent-primary font-mono border-b border-border-line pb-2">UUID v4 Generator</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full relative">
              <Input
                type="text"
                className="w-full bg-bg-panel border border-border-line rounded-lg p-4 text-center font-mono text-xl text-text-primary focus:outline-none"
                value={uuid}
                readOnly
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                onClick={generateUuid}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-4 bg-bg-panel border border-border-line rounded-lg hover:border-accent-primary hover:text-accent-primary transition-colors font-mono"
              >
                <RefreshCw size={18} /> Generate
              </button>
              <button 
                onClick={() => copyToClipboard(uuid, true)}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-4 bg-accent-primary/20 border border-accent-primary rounded-lg text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-mono"
              >
                {copiedUuid ? <Check size={18} /> : <Copy size={18} />} Copy
              </button>
            </div>
          </div>
        </div>

        {/* Password Generator */}
        <div className="flex flex-col space-y-4 pt-8">
          <h2 className="text-lg font-bold text-accent-secondary font-mono border-b border-border-line pb-2">Secure Password Generator</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-sans font-medium text-text-muted">Length: {length}</span>
                <Input 
                  type="range" 
                  min="4" 
                  max="128" 
                  value={length} 
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-48 accent-accent-secondary"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-bg-base p-4 border border-border-line rounded-lg">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input type="checkbox" className="accent-accent-secondary" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />
                  <span className="text-sm font-mono">Uppercase (A-Z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input type="checkbox" className="accent-accent-secondary" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />
                  <span className="text-sm font-mono">Lowercase (a-z)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input type="checkbox" className="accent-accent-secondary" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} />
                  <span className="text-sm font-mono">Numbers (0-9)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Input type="checkbox" className="accent-accent-secondary" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />
                  <span className="text-sm font-mono">Symbols (!@#)</span>
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-4 justify-center">
              <div className="relative">
                <Textarea
                  className="w-full h-32 bg-bg-panel border border-border-line rounded-lg p-4 font-mono text-xl text-text-primary focus:outline-none resize-none break-all"
                  value={password}
                  readOnly
                />
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={generatePassword}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-bg-panel border border-border-line rounded-lg hover:border-accent-secondary hover:text-accent-secondary transition-colors font-mono"
                >
                  <RefreshCw size={18} /> Generate
                </button>
                <button 
                  onClick={() => copyToClipboard(password, false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent-secondary/20 border border-accent-secondary rounded-lg text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-mono"
                >
                  {copiedPassword ? <Check size={18} /> : <Copy size={18} />} Copy
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}