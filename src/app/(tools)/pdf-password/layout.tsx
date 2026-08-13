import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Password Remover | ToolKit",
  description: "Remove encryption from a known PDF.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
