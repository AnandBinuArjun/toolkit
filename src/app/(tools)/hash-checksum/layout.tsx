import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hash & Checksum | ToolKit",
  description: "Calculate SHA/MD5 hashes for text and files.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
