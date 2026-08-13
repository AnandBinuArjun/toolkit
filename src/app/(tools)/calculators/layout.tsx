import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculators | ToolKit",
  description: "Quick aspect ratio and percentage math.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
