import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BPM Tapper | ToolKit",
  description: "Tap to calculate Beats Per Minute.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
