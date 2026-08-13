import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cron Helper | ToolKit",
  description: "Explain and calculate cron schedule expressions.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
