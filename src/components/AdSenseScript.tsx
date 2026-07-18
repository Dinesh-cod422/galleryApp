"use client";

import Script from 'next/script';
import { usePathname } from 'next/navigation';

export default function AdSenseScript() {
  const pathname = usePathname();

  // Exclude non-content paths
  if (pathname === '/upload' || pathname === '/wishlist') {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7320845599419472"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
