import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS ↔ Tailwind | ToolKit",
  description: "Convert CSS to Tailwind utility classes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
