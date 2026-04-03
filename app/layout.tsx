import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";

import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { WildHacksGlobalSettingsContext } from "@/contexts/wildhacks-global-settings-context";
import { getConfigDocSnapshot } from "@/lib";
import { WildHacksConfig } from "@/types";

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

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const configDocSnapshot = await getConfigDocSnapshot();
  const wildhacksConfig = configDocSnapshot.data() as WildHacksConfig;

  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="WildHacks Dashboard 2026" />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
          <WildHacksGlobalSettingsContext.Provider value={wildhacksConfig}>
            <div className="min-h-screen w-full relative root-background">
              <div className="absolute inset-0 z-0 root-background-gradient" />
              <div className="relative z-10">
                <div className="flex flex-col min-h-screen">{children}</div>
              </div>
              <Toaster />
            </div>
          </WildHacksGlobalSettingsContext.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
