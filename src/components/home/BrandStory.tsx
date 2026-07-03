import Image from "next/image";
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
            SOIS began with a simple frustration: jewellery that looked precious but couldn&apos;t survive a real life. We set out to make sterling silver that keeps up — worn in the shower, on flights, through everyday chaos, without losing its shine.
          </p>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 40, maxWidth: 460 }}>
            Every design starts on paper in our studio and ends up on someone&apos;s wrist, neck, or ear — meant to be lived in, not locked away.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 32, height: 1, background: T.sageDark }} />
            <span style={{ fontSize: "0.78rem", color: T.forest, fontWeight: 700, letterSpacing: "0.02em" }}>
              Designed in-studio, worn everywhere
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
