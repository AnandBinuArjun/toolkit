"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Languages, Copy, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";


export default function NumberNamer() {
  const [numStr, setNumStr] = useState("");
  const [copied, setCopied] = useState(false);

  const numberToEnglish = (n: string): string => {
    n = n.replace(/,/g, '').trim();
    if (!/^\d+$/.test(n)) return "Not a valid positive integer";
    if (n === "0") return "zero";

    const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    const numToWords = (num: number, suffix: string) => {
        let str = '';
        if (num > 99) {
            str += a[Math.floor(num / 100)] + 'hundred ';
            num %= 100;
        }
        if (num > 19) {
            str += b[Math.floor(num / 10)] + (num % 10 ? '-' + a[num % 10] : ' ');
        } else {
            str += a[num];
        }
        return str ? str + suffix : '';
    };

    let result = '';
    const num = BigInt(n);

    // To handle up to trillions, we do chunks of 3
    const chunks = [];
    let temp = num;
    while (temp > BigInt(0)) {
        chunks.push(Number(temp % BigInt(1000)));
        temp = temp / BigInt(1000);
    }

    const suffixes = ['', 'thousand ', 'million ', 'billion ', 'trillion ', 'quadrillion ', 'quintillion '];
    
    if (chunks.length > suffixes.length) return "Number too large!";

    for (let i = chunks.length - 1; i >= 0; i--) {
        result += numToWords(chunks[i], suffixes[i]);
    }

    return result.trim();
  };

  const output = numStr ? numberToEnglish(numStr) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id="number-namer" name="Number Namer" description="Convert large numbers into English words instantly.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel">
            Number
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none text-xl resize-none min-h-[200px]"
            placeholder="e.g. 123456789"
            value={numStr}
            onChange={(e) => setNumStr(e.target.value)}
          />
        </div>

        <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col relative">
          <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
            <span>English Words</span>
            <button onClick={handleCopy} disabled={!output} className="text-accent-primary hover:text-white transition-colors disabled:opacity-30" title="Copy Output">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <Textarea
            className="w-full flex-1 bg-transparent p-4 outline-none text-xl text-text-muted resize-none min-h-[200px]"
            value={output}
            readOnly
          />
        </div>
      </div>
    </ToolLayout>
  );
}