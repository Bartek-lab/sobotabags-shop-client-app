import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
