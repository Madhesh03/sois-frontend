import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function CategoryGrid() {
  return (
    <section className="sois-section sois-categories" aria-labelledby="categories-heading">
      <div className="sois-section-header">
        <div>
          <Eyebrow>EXPLORE</Eyebrow>
          <h2 id="categories-heading" style={{ fontSize: "clamp(1.6rem, 3vw, 2.1rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink }}>
            Browse by Category
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

      <div className="sois-cat-grid">
        <Link href="/category/rings" className="cat-tile sois-cat-hero" style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: T.surface, textDecoration: "none" }}>
          <Image className="cat-img" src={I.ringWhite} alt="Rings" fill sizes="(max-width: 767px) 100vw, 40vw" style={{ objectFit: "cover", transition: "transform 0.55s ease" }} />
          <div className="cat-overlay" style={{ position: "absolute", inset: 0, background: "rgba(29,54,56,0.32)", opacity: 0, transition: "opacity 0.35s" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px" }}>
            <div style={{ background: T.white, display: "inline-block", padding: "10px 18px", borderLeft: `3px solid ${T.forest}` }}>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: T.forest, letterSpacing: "-0.01em" }}>Rings</div>
              <div style={{ fontSize: "0.64rem", color: T.muted, marginTop: 2, fontWeight: 600 }}>24 styles →</div>
            </div>
          </div>
        </Link>

        {[
          { label: "Earrings", slug: "earrings", count: 38, img: I.earrings },
          { label: "Necklaces", slug: "necklaces", count: 31, img: I.necklace },
          { label: "Bracelets", slug: "bracelets", count: 19, img: I.bracelets },
          { label: "Anklets", slug: "anklets", count: 12, img: I.anklets },
        ].map(({ label, slug, count, img }) => (
          <Link key={label} href={`/category/${slug}`} className="cat-tile sois-cat-tile" style={{ position: "relative", overflow: "hidden", cursor: "pointer", background: T.surface, textDecoration: "none" }}>
            <Image className="cat-img" src={img} alt={label} fill sizes="(max-width: 767px) 50vw, 20vw" style={{ objectFit: "cover", transition: "transform 0.55s ease" }} />
            <div className="cat-overlay" style={{ position: "absolute", inset: 0, background: "rgba(29,54,56,0.28)", opacity: 0, transition: "opacity 0.35s" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 18px" }}>
              <div style={{ background: T.white, display: "inline-block", padding: "7px 14px", borderLeft: `2px solid ${T.forest}` }}>
                <div style={{ fontSize: "0.82rem", fontWeight: 800, color: T.forest }}>{label}</div>
                <div style={{ fontSize: "0.58rem", color: T.muted, marginTop: 1, fontWeight: 600 }}>{count} styles →</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link href="/category/gifts" className="cat-tile sois-cat-gift" style={{ marginTop: 4, position: "relative", overflow: "hidden", cursor: "pointer", height: 140, background: T.surface, display: "flex", alignItems: "center", textDecoration: "none" }}>
        <Image className="cat-img" src={I.heartPend} alt="Gift Sets" fill sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 40%", transition: "transform 0.55s ease" }} />
        <div className="cat-overlay" style={{ position: "absolute", inset: 0, background: "rgba(29,54,56,0.5)", opacity: 0.35, transition: "opacity 0.35s" }} />
        <div className="sois-cat-gift-inner" style={{ position: "relative", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: T.white, letterSpacing: "-0.01em" }}>Gift Sets</div>
            <div style={{ fontSize: "0.68rem", color: T.sage, marginTop: 3, fontWeight: 500 }}>8 curated sets · Perfect for every occasion</div>
          </div>
          <div style={{ background: T.sage, color: T.forest, padding: "12px 28px", fontSize: "0.72rem", letterSpacing: "0.12em", fontWeight: 800, transition: "background 0.2s", flexShrink: 0 }}>
            SHOP GIFTS →
          </div>
        </div>
      </Link>
    </section>
  );
}
