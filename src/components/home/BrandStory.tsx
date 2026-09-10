import Image from "next/image";
import Link from "next/link";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function BrandStory() {
  return (
    <section className="sois-section sois-story" aria-labelledby="story-heading">
      <div className="sois-story-grid">
        <div>
          <Eyebrow>OUR STORY</Eyebrow>
          <h2
            id="story-heading"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.1, marginBottom: 20 }}
          >
            The SOIS Story
          </h2>
          <span className="sois-story-quote-mark" aria-hidden="true">
            &ldquo;
          </span>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.85, color: T.ink, marginBottom: 20, maxWidth: 460, fontWeight: 500 }}>
            SOIS was founded by two sisters who believe jewellery should do more than complete an outfit — it should celebrate the person wearing it.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 36, maxWidth: 460 }}>
            More than a brand, we&apos;re a community that celebrates individuality. Every piece is designed to become part of your story — a symbol of love, strength, and unforgettable moments.
          </p>
          <Link href="/about" className="sois-story-cta">
            Be Yourself. Own Your Shine.
          </Link>
        </div>

        <div className="sois-story-img">
          <Image
            className="story-img-tile"
            src={I.brandStoryHands}
            alt="Two sisters wearing SOIS sterling silver jewellery, holding hands"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            style={{ objectFit: "cover", objectPosition: "50% 35%" }}
          />
        </div>
      </div>
    </section>
  );
}
