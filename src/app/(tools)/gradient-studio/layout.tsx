import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gradient Studio | ToolKit",
  description: "Create and export CSS linear and radial gradients.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
