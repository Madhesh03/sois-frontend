"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { I } from "@/lib/data";

const SLIDE_DURATION = 5000;
const SWIPE_THRESHOLD = 50;
const WHEEL_COOLDOWN = 700;

export function Hero() {
  const slides = I.heroBannerSlides;
  const n = slides.length;
  const [active, setActive] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const lastWheelAt = useRef(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % n), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [n]);

  const goPrev = () => setActive((a) => (a - 1 + n) % n);
  const goNext = () => setActive((a) => (a + 1) % n);

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (delta > SWIPE_THRESHOLD) goPrev();
    else if (delta < -SWIPE_THRESHOLD) goNext();
  };

  // Trackpad horizontal scroll changes slides; vertical scroll passes through
  // to the page as normal.
  const onWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    const now = Date.now();
    if (now - lastWheelAt.current < WHEEL_COOLDOWN) return;
    lastWheelAt.current = now;
    if (e.deltaX > 0) goNext();
    else goPrev();
  };

  return (
    <section className="sois-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="sois-sr-only">
        Jewellery made to celebrate who you are
      </h1>

      <div
        className="sois-hero-image"
        style={{ position: "relative", overflow: "hidden", background: "#10201d" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onWheel={onWheel}
      >
        <Link
          href="/shop"
          aria-label="Shop the new collection"
          style={{ position: "absolute", inset: 0, display: "block" }}
        >
          {slides.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt="Jewellery made to celebrate who you are"
              fill
              priority={i === 0}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
                opacity: i === active ? 1 : 0,
                transition: "opacity 1s ease",
              }}
            />
          ))}
        </Link>

        <div className="sois-hero-controls">
          <div className="sois-hero-counter">
            <span>
              {active + 1} / {n}
            </span>
            <div className="sois-hero-progress-track">
              <div
                key={active}
                className="sois-hero-progress-fill"
                style={{ animationDuration: `${SLIDE_DURATION}ms` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
