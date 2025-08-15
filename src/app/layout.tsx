import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "@/components/header";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";
import { APP_CONFIG } from "@/lib/constants";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: APP_CONFIG.name,
  description: APP_CONFIG.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geist.className} dot-grid w-screen overflow-x-hidden`}>
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <div className="mx-auto max-w-xl px-4 py-8">
              <Header />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
