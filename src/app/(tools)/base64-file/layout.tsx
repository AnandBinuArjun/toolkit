import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Base64 File Encoder | ToolKit",
  description: "Convert files and images into Base64 Data URIs.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
