import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Number Namer | ToolKit",
  description: "Convert numbers into English words.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
