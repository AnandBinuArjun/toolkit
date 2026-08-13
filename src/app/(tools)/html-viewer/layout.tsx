import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML Viewer | ToolKit",
  description: "Preview HTML in a sandboxed iframe.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
