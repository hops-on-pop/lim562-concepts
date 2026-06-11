import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteTitle = "LIM 562 Concept Explorer";
const siteDescription =
  "Interactive concept topics for LIM 562: Transformative Technologies in LIS — explore how library technology systems are planned, built, evaluated, hosted, and governed.";

export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: "%s | LIM 562",
  },
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
