import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

// Two-row category grid (4 × 2 on desktop). Slugs map to existing routes so
// functionality is unchanged — Pendant Chains lives under necklaces, the gift
// box under /category/gifts. Only the presentation is new.
const CATEGORIES: { label: string; href: string; img: string; meta: string }[] = [
  { label: "All Products", href: "/shop", img: I.prod1, meta: "Shop everything" },
  { label: "Rings", href: "/category/rings", img: I.ringWhite, meta: "24 styles" },
  { label: "Earrings", href: "/category/earrings", img: I.earrings, meta: "38 styles" },
  { label: "Necklaces", href: "/category/necklaces", img: I.necklace, meta: "31 styles" },
  { label: "Pendant Chains", href: "/category/necklaces", img: I.heartPend, meta: "22 styles" },
  { label: "Bracelets", href: "/category/bracelets", img: I.bracelets, meta: "19 styles" },
  { label: "Sets", href: "/category/sets", img: I.signatureModel, meta: "12 curated sets" },
  { label: "Surprise / Gift Box", href: "/category/gifts", img: I.editorial, meta: "Curated gifting" },
];

export function CategoryGrid() {
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
        {CATEGORIES.map(({ label, href, img, meta }, i) => (
          <Link key={label} href={href} className="sois-cat2-card" aria-label={label}>
            <Image
              className="sois-cat2-img"
              src={img}
              alt={label}
              fill
              sizes="(max-width: 600px) 50vw, (max-width: 1024px) 25vw, 22vw"
              style={{ objectFit: "cover" }}
              priority={i < 4}
            />
            <span className="sois-cat2-veil" aria-hidden="true" />
            <span className="sois-cat2-frame" aria-hidden="true" />
            <span className="sois-cat2-body">
              <span className="sois-cat2-label">{label}</span>
              <span className="sois-cat2-cta">
                {meta} <ArrowRight size={12} strokeWidth={2.4} />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
