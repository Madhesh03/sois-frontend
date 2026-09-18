import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreShell } from "@/components/store/StoreShell";
import { GiftHamperDetail } from "@/components/store/GiftHamperDetail";
import { getProductBySlug } from "@/lib/catalog";
import { siteConfig } from "@/lib/data";

// Hampers are rendered on demand from the live catalogue API, so there is no
// build-time slug list to pre-render.
export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hamper = await getProductBySlug(slug);
  if (!hamper) return { title: "Gift Hamper" };
  // Own canonical + og:url so sharing links to this hamper, not the home page
  // (see the product page for the iOS share rationale).
  const path = `/gift-hampers/${slug}`;
  return {
    title: hamper.name,
    description: hamper.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${hamper.name} | ${siteConfig.name}`,
      description: hamper.description,
      url: path,
      images: hamper.images[0] ? [{ url: hamper.images[0] }] : undefined,
    },
  };
}

export default async function GiftHamperPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hamper = await getProductBySlug(slug);
  // A hamper is a Product with is_gift_hamper set — guard so a normal product
  // slug can't render under /gift-hampers/.
  if (!hamper || !hamper.isGiftHamper) notFound();

  return (
    <StoreShell>
      <GiftHamperDetail hamper={hamper} />
    </StoreShell>
  );
}
