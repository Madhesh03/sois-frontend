"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { catalogApi, mediaUrl } from "@/lib/api";
import type { Review } from "@/lib/api";
import { ReviewCard } from "./ReviewCard";
import { computeReviewStats } from "./reviewStats";

const PAGE_SIZE = 20;
const PREVIEW_COUNT = 2;
const PHOTO_PREVIEW_COUNT = 6;

/**
 * Compact "Ratings & Reviews" teaser for the product page — rating badge,
 * a customer-photos strip, two review previews, and "View All", which links
 * to the full ReviewsModule at /product/[slug]/reviews.
 */
export function ReviewsSummary({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    catalogApi
      .listReviews({ product: productId, page: 1, page_size: PAGE_SIZE }, controller.signal)
      .then(({ items }) => {
        if (active) setReviews(items);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [productId]);

  const stats = useMemo(() => computeReviewStats(reviews), [reviews]);
  const photos = useMemo(() => reviews.flatMap((r) => r.images), [reviews]);

  if (loading || failed || stats.total === 0) return null;

  const allHref = `/product/${productSlug}/reviews`;

  return (
    <section className="sois-rvsum">
      <div className="sois-rvsum-head">
        <h2 className="sois-rvsum-title">Ratings & Reviews</h2>
        <Link href={allHref} className="sois-rvsum-badge">
          <span className="sois-rvsum-score">
            {stats.average.toFixed(1)}
            <Star size={13} fill="#ffffff" color="#ffffff" />
          </span>
          <span className="sois-rvsum-counts">
            {stats.total} {stats.total === 1 ? "review" : "reviews"}
          </span>
          <ChevronRight size={16} />
        </Link>
      </div>

      {photos.length > 0 && (
        <div className="sois-rvsum-photos">
          {photos.slice(0, PHOTO_PREVIEW_COUNT).map((img) => (
            <Link key={img.id} href={allHref} className="sois-rvsum-photo">
              <Image
                src={mediaUrl(img.view_url || img.s3_key)}
                alt=""
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </Link>
          ))}
        </div>
      )}

      <div className="sois-rvsum-preview">
        {reviews.slice(0, PREVIEW_COUNT).map((r) => (
          <ReviewCard key={r.id} review={r} showProduct={false} />
        ))}
      </div>

      <Link href={allHref} className="sois-rvsum-viewall">
        View All Reviews
        <ChevronRight size={16} />
      </Link>
    </section>
  );
}
