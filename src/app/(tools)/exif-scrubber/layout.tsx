import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EXIF Scrubber | ToolKit",
  description: "Remove EXIF metadata from images.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
