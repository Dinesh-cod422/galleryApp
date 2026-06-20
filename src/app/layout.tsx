import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Moments Gallari - Premium AI Prompts & Aesthetic Designs",
    template: "%s | Moments Gallari"
  },
  description: "Explore a curated collection of beautiful, high-quality AI prompts and custom design ideas. Copy premium prompts for Midjourney, Stable Diffusion, and more.",
  keywords: [
    "Moments Gallari",
    "Moments Gallery",
    "Moment Galleri",
    "AI Prompts",
    "Aesthetic Designs",
    "Midjourney Prompts",
    "Stable Diffusion Prompts",
    "AI Art Catalog",
    "Design Prompts",
    "Creative Prompts"
  ],
  other: {
    "google-adsense-account": "ca-pub-7320845599419472"
  },
  metadataBase: new URL("https://moment-galleri.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Moments Gallari - Premium AI Prompts & Aesthetic Designs",
    description: "Explore a curated collection of beautiful, high-quality AI prompts and custom design ideas.",
    url: "https://moment-galleri.vercel.app",
    siteName: "Moments Gallari",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Moments Gallari - Premium AI Prompts & Aesthetic Designs",
    description: "Explore a curated collection of beautiful, high-quality AI prompts and custom design ideas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Moments Gallari",
  },
};

import { ThemeProvider } from "@/components/ThemeProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import CookieConsent from "@/components/CookieConsent";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-black dark:bg-[#000000] dark:text-white transition-colors duration-300 overscroll-none select-none touch-manipulation">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <WishlistProvider>
            {children}
            <Footer />
            <MobileNavbar />
            <CookieConsent />
          </WishlistProvider>
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-QVPTWK1YV2" />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7320845599419472"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </html>
  );
}
