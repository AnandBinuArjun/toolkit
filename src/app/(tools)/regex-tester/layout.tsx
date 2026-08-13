import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Regex Tester | ToolKit",
  description: "Test regular expressions with live highlights.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
