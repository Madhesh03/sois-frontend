"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
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
const CATEGORIES: {
  label: string;
  href: string;
  img: string;
  meta: string;
  catSlug?: CategorySlug;
}[] = [
  { label: "All Products", href: "/shop", img: I.prod1, meta: "Shop everything" },
  { label: "Rings", href: "/category/rings", img: I.ringWhite, meta: "Explore styles", catSlug: "rings" },
  { label: "Earrings", href: "/category/earrings", img: I.earrings, meta: "Explore styles", catSlug: "earrings" },
  { label: "Necklaces", href: "/category/necklaces", img: I.necklace, meta: "Explore styles", catSlug: "necklaces" },
  { label: "Pendant Chains", href: "/category/necklaces", img: I.heartPend, meta: "Explore styles", catSlug: "necklaces" },
  { label: "Bracelets", href: "/category/bracelets", img: I.bracelets, meta: "Explore styles", catSlug: "bracelets" },
  { label: "Sets", href: "/category/sets", img: I.signatureModel, meta: "Curated sets", catSlug: "sets" },
  { label: "Surprise / Gift Box", href: "/category/gifts", img: I.editorial, meta: "Curated gifting", catSlug: "gifts" },
];

export function CategoryGrid() {
  // Live per-category product counts (keyed by CategorySlug). Empty until the
  // catalogue loads, so cards fall back to their static `meta` copy meanwhile.
  const [counts, setCounts] = useState<Partial<Record<CategorySlug, number>>>({});

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

  return (
    <section className="sois-section sois-categories" aria-labelledby="categories-heading">
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

      <div className="sois-cat2-grid">
        {CATEGORIES.map((c, i) => (
          <Link key={c.label} href={c.href} className="sois-cat2-card" aria-label={c.label}>
            <Image
              className="sois-cat2-img"
              src={c.img}
              alt={c.label}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 22vw"
              style={{ objectFit: "cover" }}
              priority={i < 4}
            />
            <span className="sois-cat2-veil" aria-hidden="true" />
            <span className="sois-cat2-frame" aria-hidden="true" />
            <span className="sois-cat2-body">
              <span className="sois-cat2-label">{c.label}</span>
              <span className="sois-cat2-cta">
                {metaFor(c)} <ArrowRight size={12} strokeWidth={2.4} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
