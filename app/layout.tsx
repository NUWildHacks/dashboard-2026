import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

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

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          <div className="min-h-screen w-full relative root-background">
            <div className="absolute inset-0 z-0 root-background-gradient" />
            <div className="relative z-10">
              <div className="flex flex-col min-h-screen">{children}</div>
              <Toaster />
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
