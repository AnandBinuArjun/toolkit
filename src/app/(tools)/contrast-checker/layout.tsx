import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contrast Checker | ToolKit",
  description: "Check WCAG color contrast ratios.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
