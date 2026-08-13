import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bcrypt Generator | ToolKit",
  description: "Hash and verify strings with bcrypt in your browser.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
