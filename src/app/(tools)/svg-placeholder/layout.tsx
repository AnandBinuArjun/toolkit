import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SVG Placeholder | ToolKit",
  description: "Generate SVG placeholder images with custom dimensions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
