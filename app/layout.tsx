import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const sora = Sora({ subsets: ["latin"], variable: "--font-sora", display: "swap" });
const sourceSans = Source_Sans_3({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  title: "REDS Command Center",
  description: "REDS Command Center: live celestial navigation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${sora.variable} ${sourceSans.variable}`}>
      <head>
        <Script src="https://unpkg.com/three@0.149.0/build/three.min.js" strategy="beforeInteractive" />
        <Script src="/support.js" strategy="beforeInteractive" />
        <Script src="/solar-system.js" strategy="beforeInteractive" />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
