import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Base Converter | ToolKit",
  description: "Convert between Decimal, Hex, Binary, and Octal.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
