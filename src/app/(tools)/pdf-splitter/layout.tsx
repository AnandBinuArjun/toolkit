import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Splitter | ToolKit",
  description: "Extract specific pages from a PDF.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
