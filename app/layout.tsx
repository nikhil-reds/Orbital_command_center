import type { Metadata } from "next";
import SolarSystemLoader from "./solar-system-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "REDS Command Center",
  description: "REDS Command Center: live celestial navigation",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <SolarSystemLoader />
      </body>
    </html>
  );
}
