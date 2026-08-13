import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "URL Parser | ToolKit",
  description: "Deconstruct URLs into their component parts.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
