import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lorem Ipsum | ToolKit",
  description: "Generate placeholder text paragraphs and words.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
