import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Zabrina Downloader - Download Video dari YouTube, TikTok, Instagram & Facebook",
  description:
    "Download video dan audio dari YouTube, TikTok, Instagram, dan Facebook dengan mudah, cepat, dan gratis.",
  keywords:
    "download video, youtube downloader, tiktok downloader, instagram downloader, facebook downloader",
  authors: [{ name: "Zabrina Team" }],
  openGraph: {
    title: "Zabrina Downloader",
    description: "Download video dari YouTube, TikTok, Instagram & Facebook",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
