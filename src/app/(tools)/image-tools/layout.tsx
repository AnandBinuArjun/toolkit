import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Resizer | ToolKit",
  description: "Resize images by custom dimensions, scale presets, or export a full favicon pack.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
