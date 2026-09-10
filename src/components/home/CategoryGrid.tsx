"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";
import { CategorySlug, getAllProducts } from "@/lib/catalog";

// Two-row category grid (4 × 2 on desktop). Slugs map to existing routes so
// functionality is unchanged — Pendant Chains lives under necklaces, the gift
// box under /category/gifts. Only the presentation is new.
//
// `catSlug` (when set) drives a live product count from the catalogue API,
// replacing the placeholder `meta`; entries without one keep their static copy.
// `hoverImg` (when set) crossfades in on hover/focus, same as the product
// card's hover-swap treatment.
const CATEGORIES: {
  label: string;
  href: string;
  img: string;
  hoverImg?: string;
  meta: string;
  catSlug?: CategorySlug;
}[] = [
  { label: "All Products", href: "/shop", img: I.prod1, hoverImg: I.prod1Hover, meta: "Shop everything" },
  { label: "Rings", href: "/category/rings", img: I.ringWhite, hoverImg: I.ringWhiteHover, meta: "Explore styles", catSlug: "rings" },
  { label: "Earrings", href: "/category/earrings", img: I.earrings, hoverImg: I.earringsHover, meta: "Explore styles", catSlug: "earrings" },
  { label: "Necklaces", href: "/category/necklaces", img: I.necklace, hoverImg: I.necklaceHover, meta: "Explore styles", catSlug: "necklaces" },
  { label: "Pendant Chains", href: "/category/necklaces", img: I.heartPend, hoverImg: I.heartPendHover, meta: "Explore styles", catSlug: "necklaces" },
  { label: "Bracelets", href: "/category/bracelets", img: I.bracelets, hoverImg: I.braceletsHover, meta: "Explore styles", catSlug: "bracelets" },
  { label: "Sets", href: "/category/sets", img: I.signatureModel, hoverImg: I.signatureModelHover, meta: "Curated sets", catSlug: "sets" },
  { label: "Surprise / Gift Box", href: "/category/gifts", img: I.giftBox, meta: "Curated gifting", catSlug: "gifts" },
];

function CategoryCard({
  c,
  compact,
  priority,
  meta,
}: {
  c: (typeof CATEGORIES)[number];
  compact: boolean;
  priority: boolean;
  meta: string;
}) {
  const [hovered, setHovered] = useState(false);
  const showHover = hovered && !!c.hoverImg;

  return (
    <Link
      href={c.href}
      className="sois-cat2-card"
      aria-label={c.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <Image
        className="sois-cat2-img"
        src={c.img}
        alt={c.label}
        fill
        sizes={compact ? "(max-width: 600px) 33vw, (max-width: 1024px) 18vw, 12vw" : "(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 22vw"}
        style={{ objectFit: "cover", opacity: showHover ? 0 : 1, transition: "opacity 300ms ease" }}
        priority={priority}
      />
      {c.hoverImg && (
        <Image
          className="sois-cat2-img"
          src={c.hoverImg}
          alt={c.label}
          fill
          sizes={compact ? "(max-width: 600px) 33vw, (max-width: 1024px) 18vw, 12vw" : "(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 22vw"}
          style={{
            position: "absolute",
            inset: 0,
            objectFit: "cover",
            opacity: showHover ? 1 : 0,
            transition: "opacity 300ms ease",
          }}
        />
      )}
      <span className="sois-cat2-veil" aria-hidden="true" />
      <span className="sois-cat2-frame" aria-hidden="true" />
      <span className="sois-cat2-body">
        <span className="sois-cat2-label">{c.label}</span>
        <span className="sois-cat2-cta">
          {meta} <ArrowRight size={12} strokeWidth={2.4} />
        </span>
      </span>
    </Link>
  );
}

export function CategoryGrid({ compact = false }: { compact?: boolean }) {
  // Live per-category product counts (keyed by CategorySlug). Empty until the
  // catalogue loads, so cards fall back to their static `meta` copy meanwhile.
  const [counts, setCounts] = useState<Partial<Record<CategorySlug, number>>>({});
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    getAllProducts()
      .then((all) => {
        if (!active) return;
        const tally: Partial<Record<CategorySlug, number>> = {};
        for (const p of all) tally[p.category] = (tally[p.category] ?? 0) + 1;
        setCounts(tally);
      })
      .catch(() => {
        /* keep static meta on failure */
      });
    return () => {
      active = false;
    };
  }, []);

  const metaFor = (c: (typeof CATEGORIES)[number]): string => {
    if (!c.catSlug) return c.meta;
    const n = counts[c.catSlug];
    if (n == null) return c.meta; // still loading
    return n === 1 ? "1 style" : `${n} styles`;
  };

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".sois-cat2-card");
    const step = (card?.offsetWidth ?? 160) + 12;
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
          <button
            type="button"
            className="sois-cat-slide-btn sois-cat-slide-prev"
            aria-label="Scroll categories left"
            onClick={() => scrollByCard(-1)}
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>

          <div className="sois-cat2-grid sois-cat2-grid--compact" ref={trackRef}>
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.label} c={c} compact meta={metaFor(c)} priority={false} />
            ))}
          </div>

          <button
            type="button"
            className="sois-cat-slide-btn sois-cat-slide-next"
            aria-label="Scroll categories right"
            onClick={() => scrollByCard(1)}
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        </div>
      ) : (
        <div className="sois-cat2-grid">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.label} c={c} compact={false} meta={metaFor(c)} priority={i < 4} />
          ))}
        </div>
      )}
    </section>
  );
}
