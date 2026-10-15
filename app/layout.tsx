import type { Metadata } from "next";
import { Sora, Source_Sans_3 } from "next/font/google";
import SolarSystemLoader from "./solar-system-loader";
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
      <body className="min-h-full flex flex-col">
        {children}
        <SolarSystemLoader />
      </body>
    </html>
  );
}
