"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { catalogApi } from "@/lib/api";
import type { Review } from "@/lib/api";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { Stars } from "./Stars";
import { computeReviewStats, formatReviewDate, reviewerInitials } from "./reviewStats";

const MIN_REVIEWS_TO_SHOW = 3;

/**
 * Homepage testimonials — site-wide approved-reviews feed as a scroll-snap
 * carousel with arrow controls. Renders nothing while loading, on error, or
 * with fewer than `MIN_REVIEWS_TO_SHOW` reviews, so it never shows a thin
 * or empty carousel.
 */
export function ReviewsStrip({ title }: { title: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

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

  const scroll = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : track.clientWidth;
    track.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section className="sois-section sois-testi" aria-labelledby="testi-heading">
      <div className="sois-testi-head">
        <div>
          <Eyebrow>TESTIMONIALS</Eyebrow>
          <h2 id="testi-heading" className="sois-testi-title">
            {title}
          </h2>
        </div>

        <div className="sois-testi-summary">
          <span className="sois-testi-score">{average.toFixed(1)}</span>
          <span className="sois-testi-summary-text">
            <Stars rating={average} size={15} />
            <span>Based on {total} reviews</span>
          </span>
        </div>
      </div>

      <div className="sois-testi-track" ref={trackRef}>
        {reviews.map((r) => (
          <article key={r.id} className="sois-testi-card">
            <Quote className="sois-testi-quote" size={28} aria-hidden="true" />
            <Stars rating={r.rating} size={14} />
            {r.title && <h3 className="sois-testi-card-title">{r.title}</h3>}
            {r.body && <p className="sois-testi-body">{r.body}</p>}
            <div className="sois-testi-foot">
              <span className="sois-testi-avatar" aria-hidden="true">
                {reviewerInitials(r.customer_name)}
              </span>
              <span className="sois-testi-who">
                <span className="sois-testi-name">{r.customer_name}</span>
                <span className="sois-testi-product">{r.product_name}</span>
              </span>
              <span className="sois-testi-date">{formatReviewDate(r.created_at)}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="sois-testi-nav">
        <button type="button" aria-label="Previous reviews" onClick={() => scroll(-1)}>
          <ChevronLeft size={18} />
        </button>
        <button type="button" aria-label="Next reviews" onClick={() => scroll(1)}>
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
