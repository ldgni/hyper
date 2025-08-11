import "./globals.css";

import type { Metadata } from "next";
import { Geist } from "next/font/google";

import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";

const geist = Geist({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Path",
  description: "Save and organize your links",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} mx-auto max-w-xl px-4 py-8`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange>
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
