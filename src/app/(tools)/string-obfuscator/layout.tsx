import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "String Obfuscator | ToolKit",
  description: "Obfuscate text with ROT13 and Zero-Width characters.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
