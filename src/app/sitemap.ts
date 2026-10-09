import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/data";
import {
  getAllProducts,
  getCategories,
  getGiftHampers,
} from "@/lib/catalog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date();
  const [allCategories, allProducts, giftHampers] = await Promise.all([
    getCategories(),
    getAllProducts(),
    getGiftHampers(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${base}/shop`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/gift-hampers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...[
      "/contact",
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
      priority: 0.4,
    })),
  ];

  const categoryRoutes: MetadataRoute.Sitemap = allCategories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = allProducts.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const giftHamperRoutes: MetadataRoute.Sitemap = giftHampers.map((h) => ({
    url: `${base}/gift-hampers/${h.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...productRoutes,
    ...giftHamperRoutes,
  ];
}
