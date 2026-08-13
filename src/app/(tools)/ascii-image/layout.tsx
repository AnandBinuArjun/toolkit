import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII Image Art | ToolKit",
  description: "Upload an image and convert it to ASCII art.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
