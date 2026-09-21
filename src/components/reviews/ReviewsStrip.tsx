"use client";

import { useEffect, useState } from "react";
import { catalogApi } from "@/lib/api";
import type { Review } from "@/lib/api";
import { ReviewCard } from "./ReviewCard";

/**
 * Site-wide reviews carousel — the same one component, reused as-is on the
 * homepage and on every product page (the backend feed isn't scoped to a
 * single product). Fetches its own data on mount and renders nothing while
 * loading, on error, or when there are zero approved reviews yet, so it
 * never leaves a broken/empty carousel on the page.
 */
export function ReviewsStrip({ title }: { title: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    catalogApi
      .listReviews({ page: 1, page_size: 12 }, controller.signal)
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
  }, []);

  if (loading || failed || reviews.length === 0) return null;

  return (
    <section className="sois-reviews-strip">
      <h2 className="sois-reviews-strip-title">{title}</h2>
      <div className="sois-reviews-track">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}
