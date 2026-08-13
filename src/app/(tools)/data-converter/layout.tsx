import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Converter | ToolKit",
  description: "Convert between JSON, YAML, TOML, and CSV.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
