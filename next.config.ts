import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";
import path from "path";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  publicExcludes: ["hero-background.mp4"], // Larang PWA menyentuh file video ini
});

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self' *.supabase.co *.midtrans.com app.sandbox.midtrans.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.supabase.co *.midtrans.com app.sandbox.midtrans.com https://ajax.googleapis.com; style-src 'self' 'unsafe-inline'; img-src * blob: data:; font-src 'self' data:; connect-src *; frame-src 'self' *.midtrans.com app.sandbox.midtrans.com;",
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
        ],
      },
    ];
  },
  images: {
    deviceSizes: [390, 768, 1080, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 3600,
    formats: ['image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
      }
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default withPWA(nextConfig);
