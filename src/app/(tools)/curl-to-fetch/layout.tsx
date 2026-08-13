import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Curl ↔ Fetch | ToolKit",
  description: "Convert cURL commands to fetch snippets.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
