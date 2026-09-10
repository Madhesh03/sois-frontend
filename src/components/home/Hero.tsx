"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { I } from "@/lib/data";

const SLIDE_DURATION = 5000;

export function Hero() {
  const slides = I.heroBannerSlides;
  const n = slides.length;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % n), SLIDE_DURATION);
    return () => clearInterval(id);
  }, [n]);

  const goPrev = () => setActive((a) => (a - 1 + n) % n);
  const goNext = () => setActive((a) => (a + 1) % n);

  return (
    <section className="sois-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="sois-sr-only">
        Jewellery made to celebrate who you are
      </h1>

      <div
        className="sois-hero-image"
        style={{ position: "relative", overflow: "hidden", background: "#10201d" }}
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

          <button
            type="button"
            className="sois-hero-arrow"
            aria-label="Previous slide"
            onClick={goPrev}
          >
            <ChevronLeft size={18} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className="sois-hero-arrow"
            aria-label="Next slide"
            onClick={goNext}
          >
            <ChevronRight size={18} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  );
}
