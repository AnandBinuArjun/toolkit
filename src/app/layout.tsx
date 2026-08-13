import type { Metadata } from "next";
import Image from "next/image";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CommandPalette } from "@/components/command-palette";
import { Zap } from "lucide-react";
import Link from "next/link";

import { SearchButton } from "@/components/search-button";
import { OfflineIndicator } from "@/components/offline-indicator";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans", weight: ["400", "500", "600", "700", "800"] });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL("https://abarjun.online"),
  title: "ToolKit | Client-Side Utilities",
  description: "A collection of 69+ dev, design, and product tools that run entirely in your browser.",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ToolKit",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://abarjun.online",
    siteName: "ToolKit",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "ToolKit - Client-Side Utilities",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ToolKit | Client-Side Utilities",
    description: "A collection of dev, design, and product tools that run entirely in your browser.",
    images: ["/banner.png"],
  },
  alternates: {
    canonical: "https://abarjun.online",
    languages: {
      "en-US": "https://abarjun.online",
      "x-default": "https://abarjun.online",
    },
  },
};

export const viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} font-sans bg-bg-base text-text-primary min-h-screen flex flex-col antialiased overflow-x-hidden`}>
        <nav className="border-b border-border-line bg-bg-panel/60 backdrop-blur-md sticky top-0 z-40" style={{ boxShadow: "0 1px 0 #4f46e5" }}>
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.png" alt="ToolKit Logo" width={140} height={48} className="h-12 w-auto object-contain" priority />
            </Link>
            <div className="flex items-center gap-4">
              <SearchButton />
            </div>
          </div>
        </nav>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="border-t border-border-line bg-bg-panel/30 py-8 mt-auto">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-text-primary">
                &copy; {new Date().getFullYear()} Anand Binu Arjun
              </div>
              <div className="text-xs font-mono text-text-muted flex flex-wrap gap-4">
                <a href="https://abarjun.online" target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors">
                  abarjun.online
                </a>
                <a href="https://github.com/AnandBinuArjun" target="_blank" rel="noopener noreferrer" className="hover:text-accent-primary transition-colors">
                  GitHub
                </a>
              </div>
            </div>
            <div className="text-xs text-text-muted font-mono flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-primary" style={{ boxShadow: "0 0 6px var(--accent-primary)" }}></span>
              Every tool runs entirely in your browser
            </div>
          </div>
        </footer>
        
        <OfflineIndicator />
        <CommandPalette />
      </body>
    </html>
  );
}
