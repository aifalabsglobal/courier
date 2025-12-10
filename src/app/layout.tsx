import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider } from "@clerk/nextjs";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Courier - Fast & Reliable Logistics",
  description: "Comprehensive logistics ERP system for transportation, warehouse, and fleet management",
  keywords: ["Logistics", "ERP", "Transportation", "Warehouse", "Fleet", "TMS", "WMS", "Courier"],
  authors: [{ name: "AIFA Labs Global" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Courier Logistics",
    description: "Fast & reliable courier and logistics services",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Courier Logistics",
    description: "Fast & reliable courier and logistics services",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
          <NextTopLoader showSpinner={false} />
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}

