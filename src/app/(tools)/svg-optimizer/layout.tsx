import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Optimizer | ToolKit",
  description: "Minify and clean SVG code.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
