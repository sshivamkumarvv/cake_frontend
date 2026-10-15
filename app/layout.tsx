import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../lib/cart-context";
import { LearningProvider } from "../lib/learning-context";
import { AnnouncementBar } from "../components/AnnouncementBar";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { CartDrawer } from "../components/CartDrawer";
import { SearchModal } from "../components/SearchModal";
import { AuthModal } from "../components/AuthModal";
import { MobileBottomNav } from "../components/MobileBottomNav";
import { FloatingQuickMenu } from "../components/FloatingQuickMenu";
import { SplashScreen } from "../components/SplashScreen";
import { LocationProvider } from "../lib/location-context";
import { LocationModal } from "../components/LocationModal";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Bakeistry Studio by Mitali | Artisanal Cakes & Baking Academy",
  description:
    "Handcrafted luxury cakes, bespoke celebration orders, and professional pre-recorded online baking masterclasses by Chef Mitali.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#FAF8F5] text-[#221F1C]">
        <SplashScreen />
        <LocationProvider>
          <CartProvider>
            <LearningProvider>
              <AnnouncementBar />
              <Suspense fallback={<div className="h-20 bg-[#FAF8F5]" />}>
                <Header />
              </Suspense>
              <main className="flex-1 pb-20 lg:pb-0">
                <Suspense fallback={<div className="min-h-[50vh] flex items-center justify-center text-xs text-[#736B63]">Loading Bakeistry...</div>}>
                  {children}
                </Suspense>
              </main>
              <Footer />
              <MobileBottomNav />
              <FloatingQuickMenu />
              <CartDrawer />
              <SearchModal />
              <AuthModal />
              <LocationModal />
            </LearningProvider>
          </CartProvider>
        </LocationProvider>
      </body>
    </html>
  );
}


