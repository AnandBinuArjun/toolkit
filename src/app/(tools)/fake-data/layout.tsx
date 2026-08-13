import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fake Data Generator | ToolKit",
  description: "Generate mock user data (JSON).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
