"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { TOOLS } from "@/lib/tools-registry";

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:pt-[15vh] bg-bg-base sm:bg-black/60 sm:backdrop-blur-sm">
      <div className="w-full h-full sm:h-auto sm:max-w-xl bg-bg-panel sm:border sm:border-border-line sm:rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <Command
          className="flex flex-col w-full h-full text-text-primary"
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
        >
          <div className="flex items-center border-b border-border-line px-4" cmdk-input-wrapper="">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Command.Input
              className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-text-muted disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Search tools... (e.g., 'json', 'base64')"
              autoFocus
            />
          </div>
          <Command.List className="flex-1 sm:max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
            <Command.Empty className="py-6 text-center text-sm text-text-muted">
              No tools found.
            </Command.Empty>

            {["dev", "design", "product", "fun"].map((category) => {
              const categoryTools = TOOLS.filter((t) => t.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <Command.Group
                  key={category}
                  heading={category.toUpperCase()}
                  className="px-2 py-1.5 text-xs font-mono font-medium text-text-muted"
                >
                  {categoryTools.map((tool) => (
                    <Command.Item
                      key={tool.id}
                      value={`${tool.category}:${tool.name} ${tool.description}`}
                      onSelect={() => {
                        router.push(tool.href);
                        setOpen(false);
                      }}
                      className="flex cursor-pointer items-center rounded-md px-2 py-2 text-sm aria-selected:bg-accent-primary/10 aria-selected:text-accent-primary"
                    >
                      <span className="font-mono text-xs opacity-50 mr-2">[{tool.number}]</span>
                      {tool.name}
                    </Command.Item>
                  ))}
                </Command.Group>
              );
            })}
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
