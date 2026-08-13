import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diff Viewer | ToolKit",
  description: "Compare two pieces of text side-by-side.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
