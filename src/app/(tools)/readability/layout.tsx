import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Readability Analyzer | ToolKit",
  description: "Calculate Flesch Reading Ease score.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
