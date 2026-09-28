"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { catalogApi, mediaUrl } from "@/lib/api";
import type { Review } from "@/lib/api";
import { ReviewCard } from "./ReviewCard";
import { RatingBreakdown } from "./RatingBreakdown";
import { computeReviewStats } from "./reviewStats";

const PAGE_SIZE = 60;
const INITIAL_VISIBLE = 6;
const PHOTO_TILE_LIMIT = 5;

type SortKey = "recent" | "highest" | "lowest";
type StarFilter = 0 | 1 | 2 | 3 | 4 | 5; // 0 = All

/**
 * Full ratings & reviews module for one product (the /product/[slug]/reviews
 * page) — breakdown bars, star filter chips, sort, a customer-photos grid,
 * and an expandable review list. Scoped to `productId`, the backend product
 * UUID (see catalog.ts's backend-first-with-mock-fallback `getProductBySlug`).
 */
export function ReviewsModule({
  productId,
  title = "Ratings & Reviews",
}: {
  productId: string;
  title?: string;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [starFilter, setStarFilter] = useState<StarFilter>(0);
  const [sort, setSort] = useState<SortKey>("recent");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [lightbox, setLightbox] = useState<string | null>(null);

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
    () => reviews.flatMap((r) => r.images.map((img) => ({ img, review: r }))),
    [reviews]
  );

  const visibleReviews = useMemo(() => {
    const filtered =
      starFilter === 0
        ? reviews
        : reviews.filter((r) => Math.round(r.rating) === starFilter);
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "highest") return b.rating - a.rating;
      if (sort === "lowest") return a.rating - b.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    return sorted;
  }, [reviews, starFilter, sort]);

  if (loading) return null;

  if (failed || stats.total === 0) {
    return (
      <section className="sois-rvw">
        <h1 className="sois-rvw-title">{title}</h1>
        <p className="sois-rvw-empty">
          {failed ? "Reviews couldn't be loaded right now." : "No reviews for this product yet."}
        </p>
      </section>
    );
  }

  return (
    <section className="sois-rvw">
      <h1 className="sois-rvw-title">{title}</h1>

      <RatingBreakdown stats={stats} />

      <div className="sois-rvw-filters">
        {([0, 5, 4, 3, 2, 1] as StarFilter[]).map((star) => (
          <button
            key={star}
            type="button"
            className={`sois-rvw-chip${starFilter === star ? " is-active" : ""}`}
            onClick={() => {
              setStarFilter(star);
              setVisibleCount(INITIAL_VISIBLE);
            }}
          >
            {star === 0 ? "All" : `${star} ★`}
          </button>
        ))}

        <select
          className="sois-rvw-sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort reviews"
        >
          <option value="recent">Most Recent</option>
          <option value="highest">Highest Rated</option>
          <option value="lowest">Lowest Rated</option>
        </select>
      </div>

      {photos.length > 0 && (
        <div className="sois-rvw-photos-block">
          <h3 className="sois-rvw-subhead">
            Customer Photos ({photos.length})
          </h3>
          <div className="sois-rvw-photos">
            {photos.slice(0, PHOTO_TILE_LIMIT).map(({ img }) => (
              <button
                key={img.id}
                type="button"
                className="sois-rvw-photo"
                onClick={() => setLightbox(mediaUrl(img.view_url || img.s3_key))}
              >
                <Image
                  src={mediaUrl(img.view_url || img.s3_key)}
                  alt=""
                  fill
                  sizes="90px"
                  style={{ objectFit: "cover" }}
                />
              </button>
            ))}
            {photos.length > PHOTO_TILE_LIMIT && (
              <div className="sois-rvw-photo sois-rvw-photo-more">
                +{photos.length - PHOTO_TILE_LIMIT}
              </div>
            )}
          </div>
        </div>
      )}

      <h3 className="sois-rvw-subhead">
        Customer Reviews ({visibleReviews.length})
      </h3>

      {visibleReviews.length === 0 ? (
        <p className="sois-rvw-empty">No reviews at this rating yet.</p>
      ) : (
        <div className="sois-rvw-list">
          {visibleReviews.slice(0, visibleCount).map((r) => (
            <ReviewCard key={r.id} review={r} variant="list" showProduct={false} />
          ))}
        </div>
      )}

      {visibleCount < visibleReviews.length && (
        <button
          type="button"
          className="sois-rvw-more"
          onClick={() => setVisibleCount((n) => n + INITIAL_VISIBLE)}
        >
          Show more reviews
        </button>
      )}

      {lightbox && (
        <div className="sois-rvw-lightbox" onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" />
        </div>
      )}
    </section>
  );
}
