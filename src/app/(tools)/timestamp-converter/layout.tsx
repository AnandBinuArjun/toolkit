import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timestamp Converter | ToolKit",
  description: "Convert epoch timestamps to human-readable dates.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
