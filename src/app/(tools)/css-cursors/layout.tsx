import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CSS Cursors Playground | ToolKit",
  description: "Interactive playground showing all CSS cursor properties.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
