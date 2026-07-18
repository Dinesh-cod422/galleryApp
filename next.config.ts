import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Disables Vercel Image Optimization to prevent excessive Edge requests limits
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        // Baseline security headers. Deliberately NO Content-Security-Policy:
        // the Google ad stack pulls from pagead2.googlesyndication.com,
        // www.google.com, adservice.google.com, *.adtrafficquality.google and
        // regional GA4 shards, and a policy that misses any of them silently
        // breaks ads on the site we are trying to get approved. Introduce CSP
        // later via Content-Security-Policy-Report-Only and read the reports
        // before enforcing.
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
      {
        // Pin images are content-addressed by filename and never mutate in place.
        source: "/pins/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path(applogo.png|ads.txt)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
