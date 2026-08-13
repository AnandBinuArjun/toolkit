import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Retro CRT Text | ToolKit",
  description: "Generate retro CRT and glitch text effects.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
