import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import Footer from "@/components/footer/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WildHacks Dashboard 2026",
  description: "Dashboard application for WildHacks 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen w-full bg-[#ffffff] relative">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `
                radial-gradient(circle at 30% 70%, rgba(255, 243, 190, 0.4), transparent 60%),
                radial-gradient(circle at 70% 30%, rgba(178, 255, 193, 0.35), transparent 60%)`,
            }}
          />
          <div className="relative z-10">
            {children}
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
