import type { Review } from "@/lib/api";

export interface ReviewStats {
  total: number;
  average: number;
  /** Count of reviews at each star level, keyed 1–5. */
  counts: Record<1 | 2 | 3 | 4 | 5, number>;
}

/** Ratings breakdown computed from a fetched batch of reviews (no dedicated stats endpoint). */
export function computeReviewStats(reviews: Review[]): ReviewStats {
  const counts: ReviewStats["counts"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
    counts[star] += 1;
    sum += r.rating;
  }
  return {
    total: reviews.length,
    average: reviews.length ? sum / reviews.length : 0,
    counts,
  };
}

export function reviewerInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
