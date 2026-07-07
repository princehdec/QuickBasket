import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QuickBasket — Everything. Delivered Fast.",
  description:
    "QuickBasket delivers fresh groceries from nearby stores to your door in minutes. Order now and get 20% off your first grocery order.",
  applicationName: "QuickBasket",
  authors: [{ name: "QuickBasket" }],
  keywords: [
    "grocery delivery",
    "quick basket",
    "fresh groceries",
    "nearby stores",
    "fast delivery",
  ],
};

export const viewport: Viewport = {
  themeColor: "#FF6B00",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#F8F9FA] text-gray-900">
        {children}
      </body>
    </html>
  );
}
