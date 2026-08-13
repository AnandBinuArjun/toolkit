import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SQL Formatter | ToolKit",
  description: "Format and prettify SQL queries.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
