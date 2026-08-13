import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fancy Text | ToolKit",
  description: "Convert text to fancy Unicode variations.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
