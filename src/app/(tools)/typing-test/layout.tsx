import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Typing Test | ToolKit",
  description: "Check your WPM typing speed.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
