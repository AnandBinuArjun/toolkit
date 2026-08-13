import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Timer | ToolKit",
  description: "Customizable local Pomodoro focus timer.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
