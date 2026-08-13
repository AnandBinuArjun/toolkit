import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Creator | ToolKit",
  description: "Build and print a professional invoice.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
