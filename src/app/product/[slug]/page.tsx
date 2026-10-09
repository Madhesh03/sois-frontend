import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductDetail } from "@/components/store/ProductDetail";
import { getProductBySlug, getRelatedProducts } from "@/lib/catalog";
import { siteConfig } from "@/lib/data";
import { catalogApi } from "@/lib/api";
import {
  computeReviewStats,
  type ReviewStats,
} from "@/components/reviews/reviewStats";

// Product pages are rendered on demand from the live catalogue API, so there is
// no build-time slug list to pre-render.
export const dynamicParams = true;

// Review stats for the Product structured data, mirroring the on-page
// ReviewsSummary badge (same endpoint, same page size, same compute). Returns
// null on failure so a reviews outage never breaks the product page.
async function getReviewStats(productId: string): Promise<ReviewStats | null> {
  try {
    const { items } = await catalogApi.listReviews({
      product: productId,
      page: 1,
      page_size: 20,
    });
    return computeReviewStats(items);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  // No `openGraph` key here: Next.js inherits the root layout's openGraph
  // (including its fallback image), so a share still shows SOIS branding
  // rather than falling back to the bare favicon.
  if (!product) return { title: "Product" };
  // Own canonical + og:url per product. Without these the page inherits the
  // root layout's home-page canonical/og:url, so sharing a product on iOS
  // (whose share sheet reads og:url/canonical) links to the home page.
  const path = `/product/${slug}`;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${product.name} | ${siteConfig.name}`,
      description: product.description,
      url: path,
      images: [
        {
          url: product.images[0],
          width: 1200,
          height: 1200,
          alt: product.name,
        },
      ],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product);

  // Review aggregate for structured data. Google requires rating markup to
  // match what's visible on the page, so we read it from the same reviews
  // endpoint and the same computeReviewStats() the on-page ReviewsSummary
  // badge uses (first page, up to 20) — the two can't diverge. Omitted when
  // the product has no reviews (the badge is hidden too in that case).
  const reviewStats = await getReviewStats(product.id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: siteConfig.name },
    ...(reviewStats && reviewStats.total > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: reviewStats.average.toFixed(1),
            reviewCount: reviewStats.total,
          },
        }
      : {}),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoreShell>
        <ProductDetail product={product} related={related} />
      </StoreShell>
    </>
  );
}
