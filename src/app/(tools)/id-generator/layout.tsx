import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ID & Password Generator | ToolKit",
  description: "Generate UUIDs and secure passwords.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
