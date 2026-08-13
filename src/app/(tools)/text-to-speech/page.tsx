"use client";

import React, { useState, useEffect } from "react";
import { ToolLayout } from "@/components/tool-layout";
import { TOOLS } from "@/lib/tools-registry";
import { Play, Square, Pause, Mic2, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";


export default function TextToSpeechPage() {
  const tool = TOOLS.find((t) => t.id === "text-to-speech")!;
  
  const [text, setText] = useState("Hello world! This is a completely local text-to-speech engine running right in your browser.");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setError("Text-to-Speech is not supported in this browser.");
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Default to a system default or the first English voice
        const defaultVoice = availableVoices.find(v => v.default) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!window.speechSynthesis || !text.trim()) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsSpeaking(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = (e) => {
      console.error(e);
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsSpeaking(false);
    }
  };

  const stop = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setIsPaused(false);
    }
  };

  return (
    <ToolLayout id={tool.id} name={tool.name} description={tool.description}>
      <div className="flex flex-col space-y-8 max-w-4xl mx-auto w-full">
        
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 p-6 rounded-xl flex flex-col items-center justify-center text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-lg font-bold font-mono text-red-500 mb-2">Browser Not Supported</h3>
            <p className="text-sm font-mono text-text-primary">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 flex flex-col space-y-4">
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something to hear it spoken aloud..."
                className="w-full h-64 md:h-80 bg-bg-panel border border-border-line rounded-xl p-6 font-serif text-lg md:text-xl text-text-primary focus:outline-none focus:border-accent-primary transition-colors resize-none leading-relaxed"
              />
              
              <div className="flex items-center gap-4 pt-2">
                {!isSpeaking ? (
                  <button 
                    onClick={speak}
                    disabled={!text.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent-primary/20 border border-accent-primary rounded-xl text-accent-primary hover:bg-accent-primary hover:text-black transition-colors font-sans font-semibold disabled:opacity-50"
                  >
                    <Play size={20} /> Play
                  </button>
                ) : (
                  <button 
                    onClick={pause}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-yellow-500/20 border border-yellow-500 rounded-xl text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors font-sans font-semibold"
                  >
                    <Pause size={20} /> Pause
                  </button>
                )}
                
                <button 
                  onClick={stop}
                  disabled={!isSpeaking && !isPaused}
                  className="flex items-center justify-center gap-2 px-6 py-4 bg-bg-panel border border-border-line rounded-xl text-text-muted hover:text-accent-danger transition-colors font-sans font-semibold disabled:opacity-50"
                >
                  <Square size={20} /> Stop
                </button>
              </div>

              {isSpeaking && (
                <div className="flex items-center justify-center gap-2 mt-4 p-4 bg-accent-primary/5 rounded-xl border border-accent-primary/20">
                  <Mic2 size={16} className="text-accent-primary animate-pulse" />
                  <span className="text-xs font-sans font-medium text-accent-primary uppercase tracking-widest animate-pulse">Synthesizing Audio...</span>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 flex flex-col space-y-6 bg-bg-base p-6 border border-border-line rounded-xl h-fit">
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs font-sans font-medium text-text-muted">Voice</label>
                <select
                  className="w-full bg-bg-panel border border-border-line rounded px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                >
                  {voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Speed</label>
                  <span>{rate.toFixed(1)}x</span>
                </div>
                <Input 
                  type="range" 
                  min="0.1" max="2" step="0.1"
                  value={rate} 
                  onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Pitch</label>
                  <span>{pitch.toFixed(1)}</span>
                </div>
                <Input 
                  type="range" 
                  min="0" max="2" step="0.1"
                  value={pitch} 
                  onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t border-border-line">
                <div className="flex justify-between text-xs font-sans font-medium text-text-muted">
                  <label>Volume</label>
                  <span>{Math.round(volume * 100)}%</span>
                </div>
                <Input 
                  type="range" 
                  min="0" max="1" step="0.1"
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="accent-accent-primary mt-2"
                />
              </div>

            </div>

          </div>
        )}

      </div>
    </ToolLayout>
  );
}