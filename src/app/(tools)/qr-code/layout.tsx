import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator | ToolKit",
  description: "Create and download customizable QR codes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
