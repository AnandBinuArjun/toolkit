import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Keycode Inspector | ToolKit",
  description: "Inspect JavaScript keyboard events and keycodes.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
