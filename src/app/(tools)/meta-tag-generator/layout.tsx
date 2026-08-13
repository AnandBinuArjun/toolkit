import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meta Tag Generator | ToolKit",
  description: "Generate standard and OpenGraph HTML meta tags.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
