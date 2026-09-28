"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
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
 * a customer-photos strip, two review previews, and "View All", which opens
 * the full ReviewsModule (breakdown bars, filters, sort, full list) in a
 * modal. Mirrors the two-step Myntra layout: summary on the product page,
 * full detail only after tapping through.
 */
export function ReviewsSummary({
  productId,
  onViewAll,
}: {
  productId: string;
  onViewAll: () => void;
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
  const photos = useMemo(
    () => reviews.flatMap((r) => r.images.map((img) => img)),
    [reviews]
  );

  if (loading || failed || stats.total === 0) return null;

  return (
    <section className="sois-rvsum">
      <div className="sois-rvsum-head">
        <h2 className="sois-rvsum-title">Ratings & Reviews</h2>
        <button type="button" className="sois-rvsum-badge" onClick={onViewAll}>
          <span className="sois-rvsum-score">
            {stats.average.toFixed(1)}
            <Star size={13} fill="#ffffff" color="#ffffff" />
          </span>
          <span className="sois-rvsum-counts">
            {stats.total} {stats.total === 1 ? "review" : "reviews"}
          </span>
          <ChevronRight size={16} />
        </button>
      </div>

      {photos.length > 0 && (
        <div className="sois-rvsum-photos">
          {photos.slice(0, PHOTO_PREVIEW_COUNT).map((img) => (
            <button
              type="button"
              key={img.id}
              className="sois-rvsum-photo"
              onClick={onViewAll}
            >
              <Image
                src={mediaUrl(img.view_url || img.s3_key)}
                alt=""
                fill
                sizes="72px"
                style={{ objectFit: "cover" }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="sois-rvsum-preview">
        {reviews.slice(0, PREVIEW_COUNT).map((r) => (
          <ReviewCard key={r.id} review={r} showProduct={false} />
        ))}
      </div>

      <button type="button" className="sois-rvsum-viewall" onClick={onViewAll}>
        View All Reviews
        <ChevronRight size={16} />
      </button>
    </section>
  );
}
