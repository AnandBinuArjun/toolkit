import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Case Converter | ToolKit",
  description: "Convert text between camelCase, snake_case, etc.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
