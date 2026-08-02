import type { NextConfig } from "next";

// Allow-list the S3/CDN host that serves product media (from env) so next/image
// can optimise it. See NEXT_PUBLIC_MEDIA_HOSTNAME in .env.example.
const mediaHostname = process.env.NEXT_PUBLIC_MEDIA_HOSTNAME?.trim();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      ...(mediaHostname
        ? [{ protocol: "https" as const, hostname: mediaHostname }]
        : []),
    ],
  },
};

export default nextConfig;
