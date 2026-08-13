import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OG Image Maker | ToolKit",
  description: "Design OpenGraph social cards visually.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
