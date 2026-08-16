import type { Metadata, Viewport } from "next";
import { Baloo_2, Mukta } from "next/font/google";
import "./globals.css";
import { LocationProvider } from "./context/LocationContext";
import { CartProvider } from "./contexts/CartContext";
import { SearchProvider } from "./contexts/SearchContext";
import { FloatingCart } from "./components/cart/FloatingCart";

/* Ek Type pair — both render Devanagari, so Hindi copy works without
   another font swap when i18n lands. */
const baloo = Baloo_2({
  variable: "--font-baloo",
  subsets: ["latin", "devanagari"],
  weight: ["600", "700", "800"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "600", "700"],
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
  themeColor: "#236837",
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
      className={`${baloo.variable} ${mukta.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <LocationProvider>
          <CartProvider>
            <SearchProvider>
              {children}
              <FloatingCart />
            </SearchProvider>
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}
