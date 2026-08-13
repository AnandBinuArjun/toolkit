"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, ShieldCheck, ShieldAlert, RefreshCw } from "lucide-react";
import bcrypt from "bcryptjs";
import { Input } from "@/components/ui/input";


export default function BcryptGeneratorPage() {
  const tool = TOOLS.find((t) => t.id === "bcrypt-generator")!;
  
  const [mode, setMode] = useState<"hash" | "verify">("hash");
  
  // Hash State
  const [plainText, setPlainText] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hashResult, setHashResult] = useState("");
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Verify State
  const [verifyText, setVerifyText] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  const generateHash = () => {
    if (!plainText) {
      setHashResult("");
      return;
    }
    setIsHashing(true);
    // Use setTimeout to allow UI to update before heavy synchronous hashing blocks main thread
    setTimeout(() => {
      try {
        const salt = bcrypt.genSaltSync(rounds);
        const hash = bcrypt.hashSync(plainText, salt);
        setHashResult(hash);
      } catch (e) {
        setHashResult("Error generating hash");
      } finally {
        setIsHashing(false);
      }
    }, 10);
  };

  useEffect(() => {
    if (mode === "verify") {
      if (!verifyText || !verifyHash) {
        setVerifyResult(null);
        return;
      }
      try {
        const match = bcrypt.compareSync(verifyText, verifyHash);
        setVerifyResult(match);
      } catch (e) {
        setVerifyResult(false);
      }
    }
  }, [verifyText, verifyHash, mode]);

  const copyToClipboard = () => {
    if (!hashResult) return;
    navigator.clipboard.writeText(hashResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
        
        {/* Navigation */}
        <div className="flex items-center justify-center p-1 bg-bg-panel border border-border-line rounded-lg w-full max-w-sm mx-auto">
          <button 
            onClick={() => setMode("hash")}
            className={`flex-1 px-4 py-2 rounded font-mono text-sm transition-all ${mode === "hash" ? "bg-accent-primary/20 border border-accent-primary text-accent-primary" : "text-text-muted hover:text-text-primary border border-transparent"}`}
          >
            Generate Hash
          </button>
          <button 
            onClick={() => setMode("verify")}
            className={`flex-1 px-4 py-2 rounded font-mono text-sm transition-all ${mode === "verify" ? "bg-accent-secondary/20 border border-accent-secondary text-accent-secondary" : "text-text-muted hover:text-text-primary border border-transparent"}`}
          >
            Verify Hash
          </button>
        </div>

        {mode === "hash" ? (
          <div className="flex flex-col space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Plaintext string to hash</label>
                <Input 
                  type="text" 
                  value={plainText} 
                  onChange={(e) => setPlainText(e.target.value)}
                  placeholder="Enter a secure password..."
                  className="w-full bg-bg-panel border border-border-line rounded-lg px-4 py-3 font-mono text-text-primary focus:outline-none focus:border-accent-primary"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted flex justify-between">
                  <span>Work Factor (Rounds)</span>
                  <span className="text-accent-primary">{rounds}</span>
                </label>
                <Input 
                  type="range" 
                  min="4" max="15" 
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  className="w-full accent-accent-primary mt-2"
                />
                <span className="text-[10px] text-text-muted font-mono leading-tight mt-1">Higher rounds exponentially increase time to hash.</span>
              </div>
            </div>

            <button 
              onClick={generateHash}
              disabled={!plainText || isHashing}
              className="w-full md:w-auto self-start flex items-center justify-center gap-2 px-6 py-3 bg-accent-primary/20 border border-accent-primary rounded-lg text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isHashing ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />} 
              {isHashing ? "Hashing..." : "Generate Bcrypt Hash"}
            </button>

            <div className="flex flex-col border border-border-line rounded-xl bg-bg-panel overflow-hidden relative">
              <div className="p-4 border-b border-border-line bg-bg-base flex justify-between items-center">
                <span className="text-xs font-bold font-sans font-medium text-text-muted">Resulting Hash</span>
                <button 
                  onClick={copyToClipboard}
                  disabled={!hashResult}
                  className="text-xs flex items-center gap-1 px-3 py-1 bg-bg-panel border border-border-line rounded text-text-primary hover:text-accent-primary hover:border-accent-primary transition-colors font-sans font-medium disabled:opacity-50"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />} Copy
                </button>
              </div>
              <div className="p-8 flex items-center justify-center bg-bg-base min-h-[120px]">
                {hashResult ? (
                  <span className="font-mono text-lg md:text-xl text-accent-primary break-all selection:bg-accent-primary selection:text-black text-center shadow-accent-primary/20 drop-shadow-[0_0_8px_currentColor]">
                    {hashResult}
                  </span>
                ) : (
                  <span className="font-mono text-sm text-text-muted">Generated hash will appear here.</span>
                )}
              </div>
            </div>

          </div>
        ) : (
          <div className="flex flex-col space-y-6">
            
            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Hash to verify against</label>
              <Input 
                type="text" 
                value={verifyHash} 
                onChange={(e) => setVerifyHash(e.target.value)}
                placeholder="$2a$10$..."
                className="w-full bg-bg-panel border border-border-line rounded-lg px-4 py-3 font-mono text-text-primary focus:outline-none focus:border-accent-secondary"
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs font-sans font-medium text-text-muted">Plaintext string to check</label>
              <Input 
                type="text" 
                value={verifyText} 
                onChange={(e) => setVerifyText(e.target.value)}
                placeholder="Enter password..."
                className="w-full bg-bg-panel border border-border-line rounded-lg px-4 py-3 font-mono text-text-primary focus:outline-none focus:border-accent-secondary"
              />
            </div>

            <div className={`mt-8 flex flex-col items-center justify-center p-8 rounded-xl border-2 transition-all ${verifyResult === true ? 'bg-green-500/10 border-green-500' : verifyResult === false ? 'bg-red-500/10 border-red-500' : 'bg-bg-base border-border-line'}`}>
              {verifyResult === true ? (
                <>
                  <ShieldCheck size={48} className="text-green-500 mb-4" />
                  <span className="text-2xl font-bold font-mono text-green-500 tracking-wider">MATCH</span>
                  <span className="text-sm font-mono text-emerald-600 mt-2 text-center">The plaintext string correctly hashes to this bcrypt value.</span>
                </>
              ) : verifyResult === false ? (
                <>
                  <ShieldAlert size={48} className="text-red-500 mb-4" />
                  <span className="text-2xl font-bold font-mono text-red-500 tracking-wider">DOES NOT MATCH</span>
                  <span className="text-sm font-mono text-rose-600 mt-2 text-center">Either the hash is invalid or the plaintext is incorrect.</span>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-text-muted mb-4 opacity-50" />
                  <span className="text-lg font-sans font-medium text-text-muted">Awaiting Input</span>
                  <span className="text-sm font-sans font-medium text-text-muted mt-2 text-center">Enter both fields to automatically verify.</span>
                </>
              )}
            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}