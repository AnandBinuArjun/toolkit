import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Random Choice Picker | ToolKit",
  description: "Enter a list and let the tool pick one randomly.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
