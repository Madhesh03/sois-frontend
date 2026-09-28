import { Star } from "lucide-react";
import type { ReviewStats } from "./reviewStats";

/** Average-rating headline + per-star distribution bars, Myntra-style. */
export function RatingBreakdown({ stats }: { stats: ReviewStats }) {
  const max = Math.max(1, ...Object.values(stats.counts));

  return (
    <div className="sois-rb">
      <div className="sois-rb-headline">
        <div className="sois-rb-score">
          {stats.average.toFixed(1)}
          <Star size={20} fill="#ffffff" color="#ffffff" />
        </div>
        <div className="sois-rb-count">
          {stats.total} verified {stats.total === 1 ? "review" : "reviews"}
        </div>
      </div>

      <div className="sois-rb-bars">
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = stats.counts[star];
          const pct = stats.total ? Math.round((count / max) * 100) : 0;
          return (
            <div className="sois-rb-row" key={star}>
              <span className="sois-rb-row-label">
                {star} <Star size={11} fill="#d1fae5" color="#d1fae5" />
              </span>
              <span className="sois-rb-row-track">
                <span
                  className="sois-rb-row-fill"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="sois-rb-row-count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
