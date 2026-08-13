import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Converter | ToolKit",
  description: "Convert and compress images to WebP, JPEG, or PNG with quality control.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
