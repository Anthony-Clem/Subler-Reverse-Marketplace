import type { Metadata } from "next";
import { JetBrains_Mono, Geist } from "next/font/google";
import localFont from "next/font/local";
import Providers from "./providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const generalSans = localFont({
  src: "../public/fonts/GeneralSans-Variable.woff2",
  variable: "--font-display",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Subler Reverse Marketplace — Find Spaces & Get Proposals",
  description:
    "Post your rental requirements and receive direct space proposals from verified facility hosts. Discover and match instantly on Subler.",
};

import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        generalSans.variable,
        jetbrainsMono.variable,
        "font-sans",
        geist.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground" suppressHydrationWarning>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
