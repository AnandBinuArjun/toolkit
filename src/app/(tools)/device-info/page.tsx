"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { MonitorSmartphone, Cpu, Globe, Info, Clock, CheckCircle2, XCircle } from "lucide-react";


export default function DeviceInfoPage() {
  const tool = TOOLS.find((t) => t.id === "device-info")!;
  
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !navigator) return;

    const nav = navigator as any;
    
    // Connection
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    const connectionInfo = conn ? {
      effectiveType: conn.effectiveType || "Unknown",
      downlink: conn.downlink ? `${conn.downlink} Mbps` : "Unknown",
      rtt: conn.rtt ? `${conn.rtt} ms` : "Unknown",
      saveData: conn.saveData ? "Yes" : "No"
    } : null;

    setInfo({
      // Browser & OS
      userAgent: navigator.userAgent,
      platform: navigator.platform || (navigator as any).userAgentData?.platform || "Unknown",
      language: navigator.language,
      languages: navigator.languages.join(", "),
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack || "Unspecified",
      
      // Hardware
      cores: navigator.hardwareConcurrency || "Unknown",
      memory: nav.deviceMemory ? `${nav.deviceMemory} GB+` : "Unknown",
      maxTouchPoints: navigator.maxTouchPoints || 0,
      
      // Screen
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio,
      orientation: window.screen.orientation ? window.screen.orientation.type : "Unknown",
      
      // Network
      online: navigator.onLine,
      connection: connectionInfo,

      // Capabilities
      pdfViewer: nav.pdfViewerEnabled ?? "Unknown",
      webdriver: navigator.webdriver,
      
      // Time
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      time: new Date().toString()
    });

  }, []);

  if (!info) {
    return (
      <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
        <div className="flex items-center justify-center p-20 text-accent-primary animate-pulse font-mono">
          Loading device information...
        </div>
      </ToolLayout>
    );
  }

  const InfoCard = ({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) => (
    <div className="flex flex-col bg-bg-base border border-border-line rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border-line bg-bg-panel flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-bold font-mono text-text-primary uppercase tracking-wider">{title}</h3>
      </div>
      <div className="p-4 flex flex-col space-y-4">
        {children}
      </div>
    </div>
  );

  const Row = ({ label, value, highlight = false, boolean = false }: { label: string, value: any, highlight?: boolean, boolean?: boolean }) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4 border-b border-border-line/50 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-sans font-medium text-text-muted">{label}</span>
      {boolean ? (
        value ? <CheckCircle2 size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-500" />
      ) : (
        <span className={`text-sm font-mono break-all text-right ${highlight ? "text-accent-primary font-bold" : "text-text-primary"}`}>
          {value.toString()}
        </span>
      )}
    </div>
  );

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8">
        
        {/* User Agent Block */}
        <div className="bg-bg-panel border border-border-line rounded-xl p-6 relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
            <Info size={120} />
          </div>
          <span className="text-xs font-bold font-mono text-accent-secondary uppercase tracking-widest block mb-2">Raw User Agent</span>
          <span className="text-sm md:text-base font-mono text-text-primary leading-relaxed break-all relative z-10">
            {info.userAgent}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <InfoCard title="Screen & Display" icon={<MonitorSmartphone size={18} className="text-accent-primary" />}>
            <Row label="Screen Resolution" value={`${info.screenWidth} x ${info.screenHeight}`} highlight />
            <Row label="Window (Viewport) Size" value={`${info.windowWidth} x ${info.windowHeight}`} />
            <Row label="Color Depth" value={`${info.colorDepth}-bit`} />
            <Row label="Device Pixel Ratio" value={info.pixelRatio} />
            <Row label="Orientation" value={info.orientation} />
          </InfoCard>

          <InfoCard title="Hardware & System" icon={<Cpu size={18} className="text-accent-secondary" />}>
            <Row label="Platform / OS" value={info.platform} highlight />
            <Row label="Logical CPU Cores" value={info.cores} />
            <Row label="Device Memory (RAM)" value={info.memory} />
            <Row label="Max Touch Points" value={info.maxTouchPoints} />
            <Row label="System Timezone" value={info.timezone} />
          </InfoCard>

          <InfoCard title="Network & Connection" icon={<Globe size={18} className="text-emerald-600" />}>
            <Row label="Status" value={info.online ? "Online" : "Offline"} highlight />
            {info.connection ? (
              <>
                <Row label="Effective Type" value={info.connection.effectiveType.toUpperCase()} />
                <Row label="Estimated Downlink" value={info.connection.downlink} />
                <Row label="Round Trip Time (RTT)" value={info.connection.rtt} />
                <Row label="Data Saver Mode" value={info.connection.saveData} />
              </>
            ) : (
              <Row label="Network Information API" value="Not supported in this browser" />
            )}
          </InfoCard>

          <InfoCard title="Browser Capabilities" icon={<Clock size={18} className="text-orange-400" />}>
            <Row label="Primary Language" value={info.language} highlight />
            <Row label="Accepted Languages" value={info.languages} />
            <Row label="Cookies Enabled" value={info.cookieEnabled} boolean />
            <Row label="Do Not Track" value={info.doNotTrack} />
            <Row label="Native PDF Viewer" value={info.pdfViewer} boolean />
            <Row label="Webdriver (Automation)" value={info.webdriver} boolean />
          </InfoCard>

        </div>

      </div>
    </ToolLayout>
  );
}