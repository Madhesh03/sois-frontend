import type { NextConfig } from "next";

// Allow-list the S3/CDN host that serves product media so next/image can
// optimise it. Derived from NEXT_PUBLIC_MEDIA_BASE_URL where possible, so the
// protocol and port follow whatever the media origin actually is — a local
// MinIO bucket on http://localhost:9000 works as well as an https CDN.
// NEXT_PUBLIC_MEDIA_HOSTNAME stays supported as an https-only fallback.
const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim();
const mediaHostname = process.env.NEXT_PUBLIC_MEDIA_HOSTNAME?.trim();

type RemotePattern = {
  protocol: "http" | "https";
  hostname: string;
  port?: string;
};

function mediaPattern(): RemotePattern | null {
  if (mediaBase) {
    try {
      const u = new URL(mediaBase);
      return {
        protocol: u.protocol === "http:" ? "http" : "https",
        hostname: u.hostname,
        // "" means "default port for the protocol" to next/image.
        port: u.port || "",
      };
    } catch {
      // Fall through to the hostname-only form below.
    }
  }
  return mediaHostname ? { protocol: "https", hostname: mediaHostname } : null;
}

const media = mediaPattern();

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
      ...(media ? [media] : []),
    ],
  },
};

export default nextConfig;
