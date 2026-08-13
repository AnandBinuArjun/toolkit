import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTTP Status Codes | ToolKit",
  description: "Lookup and filter HTTP status codes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
