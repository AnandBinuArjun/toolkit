import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Markdown Preview | ToolKit",
  description: "Live preview and sanitize Markdown to HTML.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
