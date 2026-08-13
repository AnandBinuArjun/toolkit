import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password Strength Meter | ToolKit",
  description: "Evaluate password entropy and strength locally.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
