import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Resizer | ToolKit",
  description: "Scale PDF pages to standard sizes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
