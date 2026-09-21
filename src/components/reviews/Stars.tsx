"use client";

import { useState } from "react";
import { Star } from "lucide-react";

const GOLD = "#F5A623";
const EMPTY = "#D1D5DB";

interface StarsProps {
  /** Read-only display mode: the average/rating to render (rounded). */
  rating?: number;
  /** Interactive mode: current selected value, paired with `onChange`. */
  value?: number;
  onChange?: (value: number) => void;
  size?: number;
}

/**
 * Read-only display mode (`rating`) or interactive input mode
 * (`value` + `onChange`) — same component, both used by the reviews
 * feature (ReviewCard reads, ReviewForm writes).
 */
export function Stars({ rating, value, onChange, size = 16 }: StarsProps) {
  const interactive = typeof onChange === "function";
  const [hover, setHover] = useState<number | null>(null);
  const display = interactive ? hover ?? value ?? 0 : Math.round(rating ?? 0);

  return (
    <div
      className={`sois-stars${interactive ? " sois-stars-input" : ""}`}
      role={interactive ? "radiogroup" : "img"}
      aria-label={interactive ? "Rating" : `Rated ${rating ?? 0} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= display;
        const icon = (
          <Star
            size={size}
            className="sois-star"
            fill={filled ? GOLD : "none"}
            color={filled ? GOLD : EMPTY}
          />
        );

        if (!interactive) {
          return <span key={n}>{icon}</span>;
        }

        return (
          <button
            key={n}
            type="button"
            className="sois-star-btn"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => onChange?.(n)}
          >
            {icon}
          </button>
        );
      })}
    </div>
  );
}
