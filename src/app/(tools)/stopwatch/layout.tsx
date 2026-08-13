import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stopwatch | ToolKit",
  description: "A simple, precise stopwatch with lap functionality.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
