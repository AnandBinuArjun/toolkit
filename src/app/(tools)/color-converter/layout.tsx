import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter | ToolKit",
  description: "Convert colors between Hex, RGB, HSL.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
