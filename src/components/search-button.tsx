"use client";

import React from "react";

export function SearchButton() {
  return (
    <button 
      className="text-sm font-sans text-text-muted hover:text-accent-primary hover:border-accent-primary/50 px-4 py-2 border border-border-line rounded-full flex items-center gap-3 transition-colors bg-bg-panel/50 backdrop-blur"
      onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
    >
      <span className="hidden sm:inline">Search tools...</span>
      <span className="sm:hidden">Search</span>
      <kbd className="hidden sm:inline-flex bg-bg-base px-1.5 py-0.5 rounded text-xs border border-border-line text-text-muted font-code">⌘K</kbd>
    </button>
  );
}
