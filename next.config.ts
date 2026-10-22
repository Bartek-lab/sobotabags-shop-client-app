import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only (Next.js ignores this in production builds, safe to commit).
  // Without this, Next.js's dev server blocks cross-origin requests to its
  // own assets (CSS/HMR/JS chunks) when the page is loaded through a tunnel
  // domain instead of localhost -- the page renders (SSR'd HTML goes
  // through fine) but every stylesheet/script request gets silently
  // rejected, which looks exactly like "the app is broken" even though
  // nothing in the app itself is wrong.
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app", "*.trycloudflare.com"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        // Product images served from Supabase Storage's public bucket
        // (see api-shop/app/storage.py's public_url()).
        protocol: "https",
        hostname: "natsrrjhgcqpsvwoobrw.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
