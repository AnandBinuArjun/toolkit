import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PX to REM | ToolKit",
  description: "Convert pixels to rem units.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
