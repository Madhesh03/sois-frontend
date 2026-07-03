"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

const slides = [
  { label: "Everyday Shine", image: I.heroModel },
  { label: "Festive Glam", image: I.signatureModel },
  { label: "Office Elegance", image: I.heroSlide2 },
  { label: "Date Night", image: I.prod2 },
  { label: "Wedding Sparkle", image: I.brandStoryImg },
  { label: "After Hours", image: I.heroSlide3 },
  { label: "Defined Impression", image: I.prod1 },
];

export function StyledForEveryOccasion() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [cw, setCw] = useState(1200);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const n = slides.length;

  // Measure the stage width so the coverflow scales responsively
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setCw(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Gentle autoplay, paused on interaction
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => a + 1), 4200);
    return () => clearInterval(id);
  }, [paused]);

  const go = useCallback((dir: -1 | 1) => setActive((a) => a + dir), []);

  const goTo = useCallback(
    (index: number) => {
      setActive((a) => {
        const cur = ((a % n) + n) % n;
        let diff = index - cur;
        if (diff > n / 2) diff -= n;
        if (diff < -n / 2) diff += n;
        return a + diff;
      });
    },
    [n]
  );

  const current = ((active % n) + n) % n;

  // Responsive coverflow geometry
  const mobile = cw <= 640;
  const tablet = cw > 640 && cw <= 1024;
  const cardW = mobile ? Math.min(cw * 0.72, 300) : tablet ? Math.min(cw * 0.46, 360) : Math.min(cw * 0.3, 380);
  const cardH = Math.round(cardW * 1.28);
  const maxVisible = mobile ? 1 : 2;
  const spread = mobile ? 0.9 : tablet ? 0.8 : 0.78;

  // Shortest signed distance of slide i from the active slide, wrapped around
  const offsetOf = (i: number) => {
    let d = (((i - active) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  };

  return (
    <section className="sois-section sois-styled-occasion" aria-labelledby="occasion-heading">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2
          id="occasion-heading"
          style={{
            fontSize: "clamp(1.35rem, 4vw, 2.1rem)",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.forest,
            lineHeight: 1.2,
            marginBottom: 12,
          }}
        >
          Styled for Every Occasion
        </h2>
        <p
          style={{
            fontSize: "0.95rem",
            color: T.muted,
            lineHeight: 1.8,
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Discover how SOIS sterling silver transforms every moment into something extraordinary
        </p>
      </div>

      <div
        className="sois-occ-stage"
        ref={stageRef}
        style={{ height: cardH + 20 }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
        onTouchStart={() => setPaused(true)}
      >
        <button
          type="button"
          className="sois-occ-arrow sois-occ-arrow-prev"
          aria-label="Previous slide"
          onClick={() => go(-1)}
        >
          <ChevronLeft size={22} color={T.forest} strokeWidth={2.2} />
        </button>

        {slides.map((slide, i) => {
          const d = offsetOf(i);
          const abs = Math.abs(d);
          const visible = abs <= maxVisible;
          const scale = abs === 0 ? 1 : abs === 1 ? 0.84 : 0.68;
          const tx = d * cardW * spread;
          const opacity = !visible ? 0 : abs === 0 ? 1 : abs === 1 ? 0.96 : 0.78;
          return (
            <button
              key={slide.label}
              type="button"
              className={`sois-occ-card${abs === 0 ? " is-active" : ""}`}
              aria-label={`${slide.label} (slide ${i + 1} of ${n})`}
              aria-hidden={!visible}
              tabIndex={visible ? 0 : -1}
              onClick={() => (abs === 0 ? undefined : goTo(i))}
              style={{
                width: cardW,
                height: cardH,
                transform: `translate(-50%, -50%) translateX(${tx}px) scale(${scale})`,
                opacity,
                zIndex: 20 - abs,
                pointerEvents: visible ? "auto" : "none",
                cursor: abs === 0 ? "default" : "pointer",
              }}
            >
              <Image
                src={slide.image}
                alt={slide.label}
                fill
                sizes="(max-width: 640px) 72vw, 380px"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
              <span className="sois-occ-pill">{slide.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          className="sois-occ-arrow sois-occ-arrow-next"
          aria-label="Next slide"
          onClick={() => go(1)}
        >
          <ChevronRight size={22} color={T.forest} strokeWidth={2.2} />
        </button>
      </div>

      {/* Dots */}
      <div className="sois-occ-dots" role="tablist" aria-label="Choose slide">
        {slides.map((slide, i) => (
          <button
            key={slide.label}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to ${slide.label}`}
            className={`sois-occ-dot${i === current ? " active" : ""}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: 36 }}>
        <a
          href="#"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: T.forest,
            color: T.sage,
            padding: "14px 32px",
            fontSize: "0.74rem",
            letterSpacing: "0.1em",
            fontWeight: 700,
            textDecoration: "none",
            borderRadius: 2,
            transition: "background 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = T.ink;
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = T.forest;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          EXPLORE COLLECTION
        </a>
      </div>
    </section>
  );
}
