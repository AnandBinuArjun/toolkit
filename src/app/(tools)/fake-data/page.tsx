"use client";

import React, { useState } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { UserPlus, Copy, Check, RefreshCw } from "lucide-react";
import { faker } from "@faker-js/faker";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function FakeData() {
  const [data, setData] = useState("");
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const generateData = () => {
    const results = [];
    for (let i = 0; i < count; i++) {
      results.push({
        id: faker.string.uuid(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        address: {
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          country: faker.location.country()
        },
        company: faker.company.name(),
        jobTitle: faker.person.jobTitle(),
      });
    }
    setData(JSON.stringify(results, null, 2));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ToolLayout id="fake-data-generator" name="Fake Data Generator" description="Generate massive amounts of realistic mock user data for testing and populating databases.">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
           <label className="text-sm font-sans font-medium text-text-muted">Count:</label>
           <Input 
             type="number" 
             className="w-20 bg-bg-panel border border-border-line rounded px-3 py-1 text-sm outline-none focus:border-accent-primary"
             value={count}
             min={1}
             max={100}
             onChange={e => setCount(parseInt(e.target.value) || 1)}
           />
           <button
             onClick={generateData}
             className="flex items-center gap-2 bg-accent-primary/20 text-accent-primary border border-accent-primary px-4 py-1.5 rounded-lg hover:bg-accent-primary hover:text-black transition-colors text-sm"
           >
             <RefreshCw className="w-4 h-4" />
             Generate
           </button>
        </div>
      </div>

      <div className="bg-bg-panel border border-border-line rounded-xl overflow-hidden flex flex-col relative">
        <div className="px-4 py-2 border-b border-border-line font-mono text-xs text-text-muted bg-bg-panel flex justify-between items-center">
          <span>JSON Output</span>
          <button onClick={handleCopy} disabled={!data} className="text-accent-primary hover:text-white transition-colors disabled:opacity-30" title="Copy Output">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <Textarea
          className="w-full bg-transparent p-4 outline-none font-mono text-sm text-text-muted resize-y min-h-[500px]"
          value={data}
          readOnly
          placeholder="Click generate to create mock data..."
          spellCheck={false}
        />
      </div>
    </ToolLayout>
  );
}