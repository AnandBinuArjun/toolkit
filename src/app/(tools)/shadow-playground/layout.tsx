import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shadow Playground | ToolKit",
  description: "Design and copy CSS box-shadows.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
