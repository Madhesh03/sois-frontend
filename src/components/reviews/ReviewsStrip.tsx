"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import { catalogApi } from "@/lib/api";
import type { Review } from "@/lib/api";
import { ReviewCard } from "./ReviewCard";
import { computeReviewStats } from "./reviewStats";

const MIN_REVIEWS_TO_SHOW = 3;

/**
 * Site-wide reviews carousel — the same one component, reused as-is on the
 * homepage and on every product page (the backend feed isn't scoped to a
 * single product). Fetches its own data on mount and renders nothing while
 * loading, on error, or when there are fewer than `MIN_REVIEWS_TO_SHOW`
 * approved reviews, so it never leaves a thin/empty carousel on the page.
 */
export function ReviewsStrip({ title }: { title: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    catalogApi
      .listReviews({ page: 1, page_size: 12 }, controller.signal)
      .then(({ items, meta }) => {
        if (active) {
          setReviews(items);
          setTotal(meta.total);
        }
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
  }, []);

  const average = useMemo(() => computeReviewStats(reviews).average, [reviews]);

  if (loading || failed || total < MIN_REVIEWS_TO_SHOW) return null;

  return (
    <section className="sois-reviews-strip">
      <div className="sois-reviews-strip-head">
        <h2 className="sois-reviews-strip-title">{title}</h2>
        <div className="sois-reviews-strip-badge">
          <Star size={15} fill="#F5A623" color="#F5A623" />
          <strong>{average.toFixed(1)}</strong>
          <span>· {total} reviews</span>
        </div>
      </div>
      <div className="sois-reviews-track">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}
