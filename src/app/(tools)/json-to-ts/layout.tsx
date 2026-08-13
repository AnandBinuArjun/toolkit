import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON to TypeScript | ToolKit",
  description: "Convert JSON objects into TypeScript interfaces.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
