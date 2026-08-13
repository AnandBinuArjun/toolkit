import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Triangle Generator | ToolKit",
  description: "Visual tool to generate CSS code for triangles.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
