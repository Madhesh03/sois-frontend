import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { ReviewsModule } from "@/components/reviews/ReviewsModule";
import { getProductBySlug, formatPrice } from "@/lib/catalog";

export const dynamicParams = true;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Reviews" };
  return {
    title: `Reviews · ${product.name}`,
    description: `Customer ratings and reviews for ${product.name}.`,
    alternates: { canonical: `/product/${slug}/reviews` },
  };
}

export default async function ProductReviewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <StoreShell>
      <div className="sois-rvpage">
        <Link href={`/product/${slug}`} className="sois-rvpage-back">
          <ChevronLeft size={16} /> Back to product
        </Link>

        <Link href={`/product/${slug}`} className="sois-rvpage-product">
          {product.images[0] && (
            <span className="sois-rvpage-thumb">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="64px"
                style={{ objectFit: "cover" }}
              />
            </span>
          )}
          <span className="sois-rvpage-product-text">
            <span className="sois-rvpage-product-name">{product.name}</span>
            <span className="sois-rvpage-product-price">{formatPrice(product.price)}</span>
          </span>
        </Link>

        <ReviewsModule productId={product.id} />
      </div>
    </StoreShell>
  );
}
