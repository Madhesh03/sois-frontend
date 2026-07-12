import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function BrandStory() {
  return (
    <section className="sois-section sois-story" aria-labelledby="story-heading">
      <div className="sois-story-grid">
        <div className="sois-story-img">
          <Image
            className="story-img-tile"
            src={I.brandStoryImg}
            alt="The story behind SOIS sterling silver jewellery"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            style={{ objectFit: "cover", objectPosition: "top" }}
          />
        </div>

        <div>
          <Eyebrow>OUR STORY</Eyebrow>
          <h2
            id="story-heading"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.1, marginBottom: 24 }}
          >
            The SOIS Story
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 20, maxWidth: 460 }}>
            SOIS was founded by two sisters who believe jewellery should do more than complete an outfit — it should celebrate the person wearing it.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 40, maxWidth: 460 }}>
            More than a brand, we&apos;re a community that celebrates individuality. Every piece is designed to become part of your story — a symbol of love, strength, and unforgettable moments.
          </p>
          <Link
            href="/about"
            style={{ display: "inline-flex", alignItems: "center", gap: 14, textDecoration: "none" }}
          >
            <div style={{ width: 32, height: 1, background: T.sageDark }} />
            <span style={{ fontSize: "0.78rem", color: T.forest, fontWeight: 700, letterSpacing: "0.02em" }}>
              Be Yourself. Own Your Shine.
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
