import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WildHacks 2026 Dashboard",
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
                radial-gradient(circle at 25% 75%, rgba(255, 243, 190, 0.9), transparent 50%),
                radial-gradient(circle at 75% 25%, rgba(178, 255, 193, 0.7), transparent 50%)`,
            }}
          />
          <div className="relative z-10">
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1 px-6 sm:px-12 flex flex-col justify-center items-center">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </div>
        </div>
      </body>
    </html>
  );
}
