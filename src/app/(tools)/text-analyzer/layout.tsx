import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text Analyzer | ToolKit",
  description: "Count words, characters, and estimate reading time.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
