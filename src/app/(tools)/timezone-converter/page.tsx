"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { Clock, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";

const TIMEZONES = [
  { label: "UTC / GMT", tz: "UTC" },
  { label: "New York (EST/EDT)", tz: "America/New_York" },
  { label: "Los Angeles (PST/PDT)", tz: "America/Los_Angeles" },
  { label: "London (GMT/BST)", tz: "Europe/London" },
  { label: "Paris (CET/CEST)", tz: "Europe/Paris" },
  { label: "Tokyo (JST)", tz: "Asia/Tokyo" },
  { label: "New Delhi (IST)", tz: "Asia/Kolkata" },
  { label: "Sydney (AEST/AEDT)", tz: "Australia/Sydney" },
  { label: "Dubai (GST)", tz: "Asia/Dubai" },
  { label: "Singapore (SGT)", tz: "Asia/Singapore" },
];


export default function TimezoneConverter() {
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    // Set to current local time on mount to avoid hydration mismatch
    const now = new Date();
    // Format to YYYY-MM-DDThh:mm
    const tzOffset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
    setLocalTime(localISOTime);
  }, []);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTime(e.target.value);
  };

  const getConvertedTime = (tz: string) => {
    if (!localTime) return "";
    try {
      const date = new Date(localTime);
      return new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <ToolLayout id="timezone-converter" name="Timezone Converter" description="Select a local date and time to see it converted across major global timezones.">
      <div className="bg-bg-panel border border-border-line rounded-xl p-6 mb-8 max-w-md mx-auto text-center">
        <label className="block text-sm text-text-muted mb-2 font-mono uppercase tracking-widest">
          Your Local Time
        </label>
        <Input
          type="datetime-local"
          className="w-full bg-bg-panel border border-border-line rounded-lg p-3 text-white outline-none focus:border-accent-primary"
          value={localTime}
          onChange={handleTimeChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIMEZONES.map((zone) => (
          <div key={zone.tz} className="bg-bg-panel border border-border-line rounded-lg p-4 flex flex-col gap-2">
            <div className="text-xs text-text-muted font-mono uppercase flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {zone.label}
            </div>
            <div className="text-lg font-medium">
              {getConvertedTime(zone.tz)}
            </div>
            <div className="text-xs text-faint font-mono">
              {zone.tz}
            </div>
          </div>
        ))}
      </div>
    </ToolLayout>
  );
}