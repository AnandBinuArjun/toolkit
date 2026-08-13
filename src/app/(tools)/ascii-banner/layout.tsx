import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ASCII Banner | ToolKit",
  description: "Generate ASCII text art for terminal tools.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
