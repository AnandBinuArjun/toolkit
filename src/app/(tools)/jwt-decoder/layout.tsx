import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JWT Decoder | ToolKit",
  description: "Decode JSON Web Tokens (client-side only).",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
