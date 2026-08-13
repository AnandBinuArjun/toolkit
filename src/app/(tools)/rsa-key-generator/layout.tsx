import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RSA Key Generator | ToolKit",
  description: "Generate RSA public and private key pairs locally.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
