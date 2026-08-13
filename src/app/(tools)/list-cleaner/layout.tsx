import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "List Cleaner | ToolKit",
  description: "Sort, deduplicate, and clean text lists.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
