import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Text to Speech | ToolKit",
  description: "Use browser synthesis to read text aloud.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
