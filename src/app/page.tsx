"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Terminal, Palette, Package, Sparkles,
  Code2, Hash, Shield, Globe, FileJson,
  Type, Image, Layers, Clock, QrCode,
  Zap, Lock, Calculator, AlignLeft,
  Music, Timer, Shuffle, Keyboard,
  Settings2, Activity, Binary, FileText,
  Braces, Link2, Scissors, Eye, Wand2,
  Cpu, Star, History
} from "lucide-react";
import { motion } from "framer-motion";
import { StatBlock } from "@/components/ui/StatBlock";
import { TOOLS, ToolCategory } from "@/lib/tools-registry";

function Key({ size }: { size: number }) {
  return <Settings2 size={size} />;
}

const TOOL_ICONS: Record<string, React.ReactNode> = {
  "json-formatter": <Braces size={18} />,
  "url-encoder": <Link2 size={18} />,
  "encode-decode": <Code2 size={18} />,
  "regex-tester": <Cpu size={18} />,
  "diff-checker": <Scissors size={18} />,
  "curl-to-fetch": <Terminal size={18} />,
  "jwt-decoder": <Lock size={18} />,
  "hash-generator": <Hash size={18} />,
  "hash-checksum": <Hash size={18} />,
  "id-generator": <Zap size={18} />,
  "base64-file": <FileText size={18} />,
  "number-base": <Binary size={18} />,
  "http-status": <Globe size={18} />,
  "cron-helper": <Clock size={18} />,
  "sql-formatter": <FileJson size={18} />,
  "list-cleaner": <AlignLeft size={18} />,
  "px-to-rem": <Type size={18} />,
  "css-minifier": <Layers size={18} />,
  "meta-tag-generator": <Globe size={18} />,
  "password-strength": <Shield size={18} />,
  "secret-sharing": <Lock size={18} />,
  "bcrypt-generator": <Shield size={18} />,
  "rsa-key-generator": <Key size={18} />,
  "string-obfuscator": <Eye size={18} />,
  "color-palette": <Palette size={18} />,
  "color-converter": <Wand2 size={18} />,
  "contrast-checker": <Eye size={18} />,
  "gradient-studio": <Layers size={18} />,
  "shadow-playground": <Layers size={18} />,
  "image-tools": <Image size={18} />,
  "image-converter": <Image size={18} />,
  "svg-optimizer": <Layers size={18} />,
  "og-maker": <Image size={18} />,
  "ascii-banner": <Type size={18} />,
  "retro-crt": <Terminal size={18} />,
  "css-triangle": <Layers size={18} />,
  "svg-placeholder": <Image size={18} />,
  "css-cursors": <Shuffle size={18} />,
  "ascii-image": <Image size={18} />,
  "qr-code": <QrCode size={18} />,
  "url-shortener": <Link2 size={18} />,
  "utm-builder": <Globe size={18} />,
  "readability": <AlignLeft size={18} />,
  "word-counter": <FileText size={18} />,
  "timestamp-converter": <Clock size={18} />,
  "timezone-converter": <Globe size={18} />,
  "calculators": <Calculator size={18} />,
  "pomodoro": <Timer size={18} />,
  "device-info": <Cpu size={18} />,
  "text-to-speech": <Music size={18} />,
  "bpm-tapper": <Music size={18} />,
  "stopwatch": <Timer size={18} />,
  "random-picker": <Shuffle size={18} />,
  "typing-test": <Keyboard size={18} />,
  "fancy-text": <Sparkles size={18} />,
  "number-namer": <Binary size={18} />,
};

const CATEGORY_ICONS: Record<ToolCategory, React.ReactNode> = {
  dev: <Terminal size={14} />,
  design: <Palette size={14} />,
  product: <Package size={14} />,
  fun: <Sparkles size={14} />,
};

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  dev: "Dev Tools",
  design: "Design",
  product: "Product",
  fun: "Fun",
};

const ICON_STYLE: Record<ToolCategory, string> = {
  dev: "bg-violet-500/10 border-violet-500/20 text-violet-400",
  design: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
  product: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  fun: "bg-rose-500/10 border-rose-500/20 text-rose-400",
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<ToolCategory>("dev");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedFavs = localStorage.getItem("toolkit-favorites");
      if (storedFavs) setFavorites(JSON.parse(storedFavs));
      const storedRecents = localStorage.getItem("toolkit-recent");
      if (storedRecents) setRecentTools(JSON.parse(storedRecents));
    } catch (e) {}
  }, []);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const newFavs = favorites.includes(id) 
      ? favorites.filter(f => f !== id) 
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("toolkit-favorites", JSON.stringify(newFavs));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const tabs: ToolCategory[] = ["dev", "design", "product", "fun"];
  const filteredTools = TOOLS.filter((t) => t.category === activeTab);
  const devCount = TOOLS.filter((t) => t.category === "dev").length;
  const designCount = TOOLS.filter((t) => t.category === "design").length;

  return (
    <div className="flex flex-col space-y-12">

      {/* Hero */}
      <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, type: "spring" }} className="relative pt-6 pb-2">
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-[200px] rounded-full opacity-20 pointer-events-none blur-3xl"
          style={{ background: "radial-gradient(ellipse, #4f46e5 0%, transparent 70%)" }}
        />
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse inline-block" />
                {TOOLS.length} tools &mdash; 100% client-side
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-text-primary leading-tight tracking-tight">
                {TOOLS.length} tools.<br />
                <span style={{ background: "linear-gradient(90deg, #4f46e5, #0ea5e9)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  Zero uploads.
                </span>
              </h1>
              <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-lg">
                Browser-native utilities for developers, designers, and makers.
                No accounts. No uploads. Everything runs locally.
              </p>
            </div>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatBlock value={TOOLS.length.toString()} label="Total Tools" icon={<Zap size={18} />} />
            <StatBlock value="100%" label="Local" icon={<Shield size={18} />} />
            <StatBlock value={tabs.length.toString()} label="Categories" icon={<Layers size={18} />} />
          </div>
        </div>
      </motion.section>

      {/* Tool Browser */}
      <section className="flex flex-col space-y-5">

        {/* Favs & Recents */}
        {isMounted && (favorites.length > 0 || recentTools.length > 0) && (
          <div className="flex flex-col gap-6 mb-2">
            {favorites.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold flex items-center gap-2 text-text-primary">
                  <Star size={16} className="text-yellow-400" fill="currentColor" /> Favorites
                </h2>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {favorites.map(id => {
                    const t = TOOLS.find(tool => tool.id === id);
                    if (!t) return null;
                    const iconStyle = ICON_STYLE[t.category as ToolCategory];
                    const toolIcon = TOOL_ICONS[t.id] ?? <Layers size={18} />;
                    return (
                      <motion.div key={t.id} variants={itemVariants}>
                        <Link href={t.href} className="group block h-full">
                          <div className="relative h-full flex flex-col p-5 bg-bg-panel border border-border-line rounded-2xl hover:border-accent-primary/40 transition-all duration-200 hover:-translate-y-0.5 group-hover:shadow-[0_0_24px_rgba(79,70,229,0.12)]">
                            <button 
                              onClick={(e) => toggleFavorite(e, t.id)}
                              className="absolute top-4 right-4 p-1.5 rounded-md transition-colors text-yellow-400 bg-yellow-400/10"
                            >
                              <Star size={16} fill="currentColor" />
                            </button>
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 flex-shrink-0 ${iconStyle}`} style={{ background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)", borderColor: "rgba(79, 70, 229, 0.2)" }}>
                              {toolIcon}
                            </div>
                            <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent-primary transition-colors mb-1.5 pr-8">
                              {t.name}
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-auto">
                              {t.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
            
            {recentTools.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold flex items-center gap-2 text-text-primary">
                  <History size={16} className="text-accent-secondary" /> Recently Used
                </h2>
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {recentTools.map(id => {
                    const t = TOOLS.find(tool => tool.id === id);
                    if (!t) return null;
                    const isFav = favorites.includes(t.id);
                    const iconStyle = ICON_STYLE[t.category as ToolCategory];
                    const toolIcon = TOOL_ICONS[t.id] ?? <Layers size={18} />;
                    return (
                      <motion.div key={t.id} variants={itemVariants}>
                        <Link href={t.href} className="group block h-full">
                          <div className="relative h-full flex flex-col p-5 bg-bg-panel border border-border-line rounded-2xl hover:border-accent-primary/40 transition-all duration-200 hover:-translate-y-0.5 group-hover:shadow-[0_0_24px_rgba(79,70,229,0.12)]">
                            <button 
                              onClick={(e) => toggleFavorite(e, t.id)}
                              className={`absolute top-4 right-4 p-1.5 rounded-md transition-colors ${isFav ? "text-yellow-400 bg-yellow-400/10" : "text-text-muted opacity-0 group-hover:opacity-100 hover:bg-border-line"}`}
                            >
                              <Star size={16} fill={isFav ? "currentColor" : "none"} />
                            </button>
                            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 flex-shrink-0 ${iconStyle}`} style={{ background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)", borderColor: "rgba(79, 70, 229, 0.2)" }}>
                              {toolIcon}
                            </div>
                            <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent-primary transition-colors mb-1.5 pr-8">
                              {t.name}
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-auto">
                              {t.description}
                            </p>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* Pill tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeTab === tab
                  ? "bg-accent-primary text-white border-accent-primary shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                  : "bg-bg-panel text-text-muted border-border-line hover:border-accent-primary/50 hover:text-text-primary"
              }`}
            >
              {CATEGORY_ICONS[tab]}
              {CATEGORY_LABELS[tab]}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                activeTab === tab ? "bg-white/20 text-white" : "bg-border-line text-text-muted"
              }`}>
                {TOOLS.filter((t) => t.category === tab).length}
              </span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div key={activeTab} variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-4">
          {filteredTools.map((tool) => {
            const iconStyle = ICON_STYLE[tool.category as ToolCategory];
            const toolIcon = TOOL_ICONS[tool.id] ?? <Layers size={18} />;
            const isFav = favorites.includes(tool.id);
            return (
              <motion.div key={tool.id} variants={itemVariants}>
                <Link href={tool.href} className="group block h-full">
                  <div className="relative h-full flex flex-col p-5 bg-bg-panel border border-border-line rounded-2xl hover:border-accent-primary/40 transition-all duration-200 hover:-translate-y-0.5 group-hover:shadow-[0_0_24px_rgba(79,70,229,0.12)]">
                    <button 
                      onClick={(e) => toggleFavorite(e, tool.id)}
                      className={`absolute top-4 right-4 p-1.5 rounded-md transition-colors ${isFav ? "text-yellow-400 bg-yellow-400/10" : "text-text-muted opacity-0 group-hover:opacity-100 hover:bg-border-line"}`}
                    >
                      <Star size={16} fill={isFav ? "currentColor" : "none"} />
                    </button>
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 flex-shrink-0 ${iconStyle}`} style={{ background: "linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0.05) 100%)", borderColor: "rgba(79, 70, 229, 0.2)" }}>
                      {toolIcon}
                    </div>
                    <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-accent-primary transition-colors mb-1.5 pr-8">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed line-clamp-2 mt-auto">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredTools.length === 0 && (
          <div className="py-16 text-center text-text-muted border border-dashed border-border-line rounded-2xl">
            <Sparkles size={32} className="mx-auto mb-3 opacity-40" />
            <p className="font-medium">No tools in this category yet.</p>
          </div>
        )}
      </section>

    </div>
  );
}