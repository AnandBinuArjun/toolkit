"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Copy, Check, Plus, Trash2, Shuffle } from "lucide-react";
import { Input } from "@/components/ui/input";

// ── Types ──────────────────────────────────────────────
type Mode = "gradient" | "glass";
type GradientType = "linear" | "radial";

interface Stop { color: string; position: number; }

// ── Randomize helpers ──────────────────────────────────
const PRESET_BACKGROUNDS = [
  "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
  "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
  "linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
  "linear-gradient(135deg,#43e97b 0%,#38f9d7 100%)",
  "linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
  "linear-gradient(135deg,#a18cd1 0%,#fbc2eb 100%)",
  "linear-gradient(135deg,#ff9a9e 0%,#fad0c4 60%,#fad0c4 100%)",
  "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
];

function randomHex() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

// ── Main component ────────────────────────────────────

export default function GradientStudioPage() {
  const tool = TOOLS.find((t) => t.id === "gradient-studio")!;

  const [mode, setMode] = useState<Mode>("gradient");

  // ── Gradient state ──
  const [gradType, setGradType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<Stop[]>([
    { color: "#7c5cfc", position: 0 },
    { color: "#00d4ff", position: 100 },
  ]);
  const [gradCSS, setGradCSS] = useState("");
  const [copiedGrad, setCopiedGrad] = useState(false);

  // ── Glass state ──
  const [tintColor, setTintColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(15);
  const [blur, setBlur] = useState(12);
  const [saturation, setSaturation] = useState(180);
  const [bgPreset, setBgPreset] = useState(PRESET_BACKGROUNDS[0]);
  const [glassCSS, setGlassCSS] = useState("");
  const [copiedGlass, setCopiedGlass] = useState(false);

  // ── Gradient CSS builder ──
  useEffect(() => {
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const s = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
    setGradCSS(
      gradType === "linear"
        ? `linear-gradient(${angle}deg, ${s})`
        : `radial-gradient(circle, ${s})`
    );
  }, [gradType, angle, stops]);

  // ── Glass CSS builder ──
  useEffect(() => {
    const hex = tintColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const css = [
      `background: rgba(${r}, ${g}, ${b}, ${(opacity / 100).toFixed(2)});`,
      `backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `-webkit-backdrop-filter: blur(${blur}px) saturate(${saturation}%);`,
      `border: 1px solid rgba(${r}, ${g}, ${b}, 0.2);`,
      `border-radius: 16px;`,
    ].join("\n");
    setGlassCSS(css);
  }, [tintColor, opacity, blur, saturation]);

  // ── Stop helpers ──
  const updateStopColor = (i: number, c: string) => {
    const n = [...stops]; n[i] = { ...n[i], color: c }; setStops(n);
  };
  const updateStopPos = (i: number, p: number) => {
    const n = [...stops]; n[i] = { ...n[i], position: p }; setStops(n);
  };
  const addStop = () => {
    if (stops.length >= 5) return;
    setStops([...stops, { color: randomHex(), position: 50 }]);
  };
  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, idx) => idx !== i));
  };
  const randomizeGrad = () => {
    setStops([
      { color: randomHex(), position: 0 },
      { color: randomHex(), position: 100 },
    ]);
    setAngle(Math.floor(Math.random() * 360));
  };

  const copyGrad = () => {
    navigator.clipboard.writeText(`background: ${gradCSS};`);
    setCopiedGrad(true); setTimeout(() => setCopiedGrad(false), 2000);
  };
  const copyGlass = () => {
    navigator.clipboard.writeText(glassCSS);
    setCopiedGlass(true); setTimeout(() => setCopiedGlass(false), 2000);
  };

  // Glass tint rgba helper for live preview
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha / 100})`;
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-6">

        {/* Mode Tabs */}
        <div className="flex gap-2">
          {(["gradient", "glass"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all capitalize ${
                mode === m
                  ? "bg-accent-primary text-white border-accent-primary"
                  : "bg-bg-panel text-text-muted border-border-line hover:border-accent-primary/50 hover:text-text-primary"
              }`}
              style={mode === m ? { boxShadow: "0 0 16px rgba(124,92,252,0.35)" } : {}}
            >
              {m === "gradient" ? "Gradient" : "Glassmorphism"}
            </button>
          ))}
        </div>

        {/* ── GRADIENT MODE ────────────────────────────── */}
        {mode === "gradient" && (
          <>
            {/* Preview */}
            <div
              className="w-full h-56 md:h-72 rounded-2xl border border-border-line shadow-2xl transition-all"
              style={{ background: gradCSS }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Controls */}
              <div className="lg:col-span-3 flex flex-col space-y-5 bg-bg-panel/60 p-5 border border-border-line rounded-2xl">
                {/* Type + Angle */}
                <div className="flex items-end gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Type</label>
                    <div className="flex gap-2">
                      {(["linear", "radial"] as GradientType[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => setGradType(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors capitalize ${
                            gradType === t
                              ? "bg-accent-primary/20 border-accent-primary text-accent-primary"
                              : "border-border-line text-text-muted hover:border-accent-primary/40"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  {gradType === "linear" && (
                    <div className="flex flex-col space-y-1.5 flex-1">
                      <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex justify-between">
                        Angle <span className="text-accent-primary">{angle}&deg;</span>
                      </label>
                      <Input
                        type="range" min="0" max="360" value={angle}
                        onChange={(e) => setAngle(parseInt(e.target.value))}
                        className="w-full accent-accent-primary"
                      />
                    </div>
                  )}

                  <button
                    onClick={randomizeGrad}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border-line text-text-muted hover:text-accent-primary hover:border-accent-primary/40 text-xs font-medium transition-colors"
                  >
                    <Shuffle size={13} /> Randomize
                  </button>
                </div>

                {/* Color Stops */}
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Color Stops</label>
                    <button
                      onClick={addStop} disabled={stops.length >= 5}
                      className="text-xs flex items-center gap-1 bg-accent-primary/10 text-accent-primary px-2 py-1 rounded-lg border border-accent-primary/20 hover:bg-accent-primary hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                  <div className="flex flex-col space-y-2">
                    {stops.map((stop, i) => (
                      <div key={i} className="flex items-center gap-3 bg-bg-panel p-3 border border-border-line rounded-xl">
                        <Input
                          type="color" value={stop.color}
                          onChange={(e) => updateStopColor(i, e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0 shrink-0"
                        />
                        <Input
                          type="text" value={stop.color.toUpperCase()}
                          onChange={(e) => updateStopColor(i, e.target.value)}
                          className="w-24 bg-black/30 border border-border-line rounded-lg px-2 py-1 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                        />
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="range" min="0" max="100" value={stop.position}
                            onChange={(e) => updateStopPos(i, parseInt(e.target.value))}
                            className="flex-1 accent-accent-secondary"
                          />
                          <span className="text-xs font-sans font-medium text-text-muted w-8 text-right">{stop.position}%</span>
                        </div>
                        <button
                          onClick={() => removeStop(i)} disabled={stops.length <= 2}
                          className="p-1 text-text-muted hover:text-accent-danger transition-colors disabled:opacity-20 shrink-0"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Output */}
              <div className="lg:col-span-2 flex flex-col bg-black/30 border border-border-line rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border-line flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium uppercase tracking-wide">CSS Output</span>
                  <button
                    onClick={copyGrad}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-medium"
                  >
                    {copiedGrad ? <Check size={13} /> : <Copy size={13} />} Copy
                  </button>
                </div>
                <pre className="p-5 font-mono text-xs text-text-primary whitespace-pre-wrap break-all leading-relaxed flex-1">
                  <span className="text-accent-primary">background:</span>{"\n"}
                  {"  "}{gradCSS};
                </pre>
              </div>
            </div>
          </>
        )}

        {/* ── GLASSMORPHISM MODE ──────────────────────── */}
        {mode === "glass" && (
          <>
            {/* Live Preview */}
            <div
              className="relative w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-border-line"
              style={{ background: bgPreset }}
            >
              {/* Decorative blobs */}
              <div className="absolute top-6 left-10 w-28 h-28 rounded-full bg-pink-400/60" />
              <div className="absolute bottom-6 right-10 w-20 h-20 rounded-full bg-yellow-300/60" />
              <div className="absolute bottom-10 left-1/3 w-16 h-16 rounded-full bg-teal-300/60" />
              <div className="absolute top-12 right-1/3 w-12 h-12 rounded-full bg-blue-400/50" />

              {/* Glass card */}
              <div
                className="absolute inset-0 m-auto w-52 h-28 flex items-center justify-center"
                style={{
                  background: hexToRgba(tintColor, opacity),
                  backdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  WebkitBackdropFilter: `blur(${blur}px) saturate(${saturation}%)`,
                  border: `1px solid ${hexToRgba(tintColor, 30)}`,
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
                }}
              >
                <span className="text-white font-bold text-lg drop-shadow">Glassmorphism</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Controls */}
              <div className="lg:col-span-3 flex flex-col space-y-5 bg-bg-panel/60 p-5 border border-border-line rounded-2xl">

                {/* Tint + Opacity */}
                <div className="flex items-end gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Tint Color</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="color" value={tintColor}
                        onChange={(e) => setTintColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0 bg-transparent"
                      />
                      <span className="font-mono text-sm text-text-primary">{tintColor.toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex justify-between">
                      Opacity <span className="text-accent-primary">{opacity}%</span>
                    </label>
                    <Input
                      type="range" min="0" max="80" value={opacity}
                      onChange={(e) => setOpacity(parseInt(e.target.value))}
                      className="w-full accent-accent-primary"
                    />
                  </div>
                </div>

                {/* Blur + Saturation */}
                <div className="flex gap-4">
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex justify-between">
                      Blur <span className="text-accent-secondary">{blur}px</span>
                    </label>
                    <Input
                      type="range" min="0" max="40" value={blur}
                      onChange={(e) => setBlur(parseInt(e.target.value))}
                      className="w-full accent-accent-secondary"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5 flex-1">
                    <label className="text-xs text-text-muted font-medium uppercase tracking-wide flex justify-between">
                      Saturation <span className="text-accent-secondary">{saturation}%</span>
                    </label>
                    <Input
                      type="range" min="100" max="300" value={saturation}
                      onChange={(e) => setSaturation(parseInt(e.target.value))}
                      className="w-full accent-accent-secondary"
                    />
                  </div>
                </div>

                {/* Background presets */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs text-text-muted font-medium uppercase tracking-wide">Background Preset</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_BACKGROUNDS.map((bg, i) => (
                      <button
                        key={i}
                        onClick={() => setBgPreset(bg)}
                        className={`w-8 h-8 rounded-lg border-2 transition-all ${bgPreset === bg ? "border-accent-primary scale-110" : "border-transparent hover:border-border-line"}`}
                        style={{ background: bg }}
                        title={`Preset ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Glass CSS Output */}
              <div className="lg:col-span-2 flex flex-col bg-black/30 border border-border-line rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-border-line flex items-center justify-between">
                  <span className="text-xs text-text-muted font-medium uppercase tracking-wide">CSS Output</span>
                  <button
                    onClick={copyGlass}
                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 bg-accent-secondary/10 border border-accent-secondary/30 rounded-lg text-accent-secondary hover:bg-accent-secondary hover:text-black transition-colors font-medium"
                  >
                    {copiedGlass ? <Check size={13} /> : <Copy size={13} />} Copy
                  </button>
                </div>
                <pre className="p-5 font-mono text-xs text-text-primary whitespace-pre-wrap break-all leading-relaxed flex-1">
                  {glassCSS.split("\n").map((line, i) => (
                    <span key={i}>
                      {line.startsWith("background") || line.startsWith("backdrop") || line.startsWith("-webkit") || line.startsWith("border") || line.startsWith("border-radius")
                        ? <><span className="text-accent-primary">{line.split(":")[0]}</span>:{line.split(":").slice(1).join(":")}</>
                        : line}
                      {"\n"}
                    </span>
                  ))}
                </pre>
              </div>
            </div>
          </>
        )}

      </div>
    </ToolLayout>
  );
}