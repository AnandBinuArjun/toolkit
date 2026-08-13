import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Merger | ToolKit",
  description: "Combine multiple PDF files locally.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
