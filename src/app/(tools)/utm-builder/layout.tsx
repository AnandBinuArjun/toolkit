import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UTM Builder | ToolKit",
  description: "Build URLs with UTM parameters for tracking.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
