"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";
import { CategorySlug } from "@/lib/catalog";

// Two-row category grid (4 × 2 on desktop). Pendants live under the same
// Necklaces category as everywhere else on the site (nav, shop filters) —
// there's no separate "Pendant Chains" card. All Products spans two grid
// cells so the 7 cards still fill the full 8-cell 4×2 layout.
const CATEGORIES: {
  label: string;
  href: string;
  img: string;
  catSlug?: CategorySlug;
  big?: boolean;
}[] = [
  { label: "All Products", href: "/shop", img: I.prod1, big: true },
  { label: "Rings", href: "/category/rings", img: I.ringWhite, catSlug: "rings" },
  { label: "Earrings", href: "/category/earrings", img: I.earrings, catSlug: "earrings" },
  { label: "Necklaces", href: "/category/necklaces", img: I.necklace, catSlug: "necklaces" },
  { label: "Bracelets", href: "/category/bracelets", img: I.bracelets, catSlug: "bracelets" },
  { label: "Sets", href: "/category/sets", img: I.signatureModel, catSlug: "sets" },
  { label: "Surprise / Gift Box", href: "/category/gifts", img: I.giftBox, catSlug: "gifts" },
];

function CategoryCard({
  c,
  compact,
  priority,
}: {
  c: (typeof CATEGORIES)[number];
  compact: boolean;
  priority: boolean;
}) {
  return (
    <Link
      href={c.href}
      className={`sois-cat2-card${c.big && !compact ? " sois-cat2-card--big" : ""}`}
      aria-label={c.label}
    >
      <Image
        className="sois-cat2-img"
        src={c.img}
        alt={c.label}
        fill
        sizes={compact ? "(max-width: 600px) 33vw, (max-width: 1024px) 18vw, 12vw" : "(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 22vw"}
        style={{ objectFit: "cover" }}
        priority={priority}
      />
      <span className="sois-cat2-veil" aria-hidden="true" />
      <span className="sois-cat2-frame" aria-hidden="true" />
      <span className="sois-cat2-body">
        <span className="sois-cat2-label">{c.label}</span>
      </span>
    </Link>
  );
}

export function CategoryGrid({ compact = false }: { compact?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  // Arrows are only useful when the chips actually overflow their track —
  // showing them on a row that already fits just reads as dead controls.
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const check = () => setOverflowing(el.scrollWidth > el.clientWidth + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [compact]);

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const chip = el.querySelector<HTMLElement>(".sois-cat-chip");
    const step = (chip?.offsetWidth ?? 110) + 24;
    el.scrollBy({ left: dir * step * 2, behavior: "smooth" });
  };

  return (
    <section
      className={`sois-section sois-categories${compact ? " sois-categories--compact" : ""}`}
      aria-labelledby={compact ? undefined : "categories-heading"}
    >
      {!compact && (
        <div className="sois-section-header">
          <div>
            <Eyebrow>EXPLORE</Eyebrow>
            <h2 id="categories-heading" style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink }}>
              Explore by Category
            </h2>
          </div>
          <Link
            href="/shop"
            className="sois-section-link"
            style={{
              fontSize: "0.74rem",
              color: T.forest,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontWeight: 700,
              letterSpacing: "0.06em",
              transition: "opacity 0.2s",
              borderBottom: `1px solid ${T.sageDark}`,
              paddingBottom: 2,
              flexShrink: 0,
            }}
          >
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
      )}

      {compact ? (
        <div className="sois-cat-slider">
          {overflowing && (
            <button
              type="button"
              className="sois-cat-slide-btn sois-cat-slide-prev"
              aria-label="Scroll categories left"
              onClick={() => scrollByCard(-1)}
            >
              <ChevronLeft size={18} strokeWidth={2.4} />
            </button>
          )}

          <div className="sois-cat-chips" ref={trackRef}>
            {CATEGORIES.map((c) => (
              <Link key={c.label} href={c.href} className="sois-cat-chip">
                <span className="sois-cat-chip-img">
                  <Image
                    src={c.img}
                    alt=""
                    fill
                    sizes="120px"
                    style={{ objectFit: "cover" }}
                  />
                </span>
                <span className="sois-cat-chip-label">{c.label}</span>
              </Link>
            ))}
          </div>

          {overflowing && (
            <button
              type="button"
              className="sois-cat-slide-btn sois-cat-slide-next"
              aria-label="Scroll categories right"
              onClick={() => scrollByCard(1)}
            >
              <ChevronRight size={18} strokeWidth={2.4} />
            </button>
          )}
        </div>
      ) : (
        <div className="sois-cat2-grid">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.label} c={c} compact={false} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
