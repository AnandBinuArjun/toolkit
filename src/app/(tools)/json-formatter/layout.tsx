import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter | ToolKit",
  description: "Prettify, validate or minify JSON.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
