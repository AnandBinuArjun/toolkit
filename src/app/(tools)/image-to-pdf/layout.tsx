import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image to PDF | ToolKit",
  description: "Convert images to a single PDF document.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
