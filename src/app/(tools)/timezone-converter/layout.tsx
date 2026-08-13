import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timezone Converter | ToolKit",
  description: "Convert dates across global timezones.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
