import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";

/**
 * Pre-launch sitemap: the coming-soon landing page plus the policy and contact
 * pages that payment gateways and crawlers verify. Catalogue routes (shop,
 * categories, products) are re-added at launch — see the block kept in
 * git history / the launch checklist in LAUNCH_CHECKLIST.md.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...[
      "/contact",
      "/about",
      "/faq",
      "/shipping-policy",
      "/return-policy",
      "/refund-policy",
      "/privacy-policy",
      "/terms",
    ].map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
