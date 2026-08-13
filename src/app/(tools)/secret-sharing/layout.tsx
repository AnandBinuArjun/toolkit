import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Secret Sharing | ToolKit",
  description: "Encrypt and share a secret via URL.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
