"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { catalogApi, mapListItem, mediaUrl } from "@/lib/api";
import type { Review } from "@/lib/api";
import { Stars } from "./Stars";
import { computeReviewStats } from "./reviewStats";

const MIN_REVIEWS_TO_SHOW = 3;

/**
 * Testimonials carousel over the site-wide approved-reviews feed, shared by
 * the homepage and every product page. Photo-first cards (customer photo on
 * top, text/stars/name centred beneath) with plain prev/next arrows. Renders
 * nothing while loading, on error, or with fewer than `MIN_REVIEWS_TO_SHOW`
 * reviews, so it never shows a thin or empty carousel.
 */
export function ReviewsStrip({ title = "Testimonials" }: { title?: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    catalogApi
      .listReviews({ page: 1, page_size: 12 }, controller.signal)
      .then(({ items, meta }) => {
        if (!active) return;
        setReviews(items);
        setTotal(meta.total);
        // Reviews without a customer photo borrow the reviewed product's
        // photo instead of leaving an empty tile; best-effort only.
        const ids = [...new Set(items.filter((r) => !r.images.length).map((r) => r.product))];
        catalogApi
          .listProductsByIds(ids, controller.signal)
          .then((products) => {
            if (!active) return;
            const map: Record<string, string> = {};
            for (const p of products) map[p.id] = mapListItem(p).images[0];
            setProductImages(map);
          })
          .catch(() => {});
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
      <h2 id="testi-heading" className="sois-testi-title">
        {title}
      </h2>
      <div className="sois-testi-rating">
        <Stars rating={average} size={18} />
        <span>
          {average.toFixed(1)} <Star size={13} fill="#0a0a0a" color="#0a0a0a" /> ({total})
        </span>
      </div>

      <div className="sois-testi-track" ref={trackRef}>
        {reviews.map((r) => {
          const photo = r.images[0];
          const src = photo
            ? mediaUrl(photo.view_url || photo.s3_key)
            : productImages[r.product];
          return (
            <article key={r.id} className="sois-testi-card">
              {src && (
                <div className="sois-testi-media">
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width: 767px) 80vw, (max-width: 1024px) 40vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
              <div className="sois-testi-content">
                {!src && <Quote className="sois-testi-quote" size={34} aria-hidden="true" />}
                {(r.body || r.title) && (
                  <p className="sois-testi-body">{r.body || r.title}</p>
                )}
                <Stars rating={r.rating} size={16} />
                <div className="sois-testi-name">{r.customer_name}</div>
                <div className="sois-testi-product">{r.product_name}</div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="sois-testi-nav">
        <button type="button" aria-label="Previous reviews" onClick={() => scroll(-1)}>
          <ChevronLeft size={26} />
        </button>
        <button type="button" aria-label="Next reviews" onClick={() => scroll(1)}>
          <ChevronRight size={26} />
        </button>
      </div>

      <div className="sois-testi-all">
        <Link href="/reviews">View all reviews</Link>
      </div>
    </section>
  );
}
