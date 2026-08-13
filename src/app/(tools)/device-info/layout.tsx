import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Device & Browser Info | ToolKit",
  description: "Display your current device and browser capabilities.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
