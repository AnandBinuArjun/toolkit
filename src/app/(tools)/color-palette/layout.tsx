import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Palette | ToolKit",
  description: "Generate and extract color palettes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
