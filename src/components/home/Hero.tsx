"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { I } from "@/lib/data";

export function Hero() {
  const slides = [I.heroBannerShine, I.heroBannerCelebrate];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="sois-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="sois-sr-only">
        Be Yourself, Own Your Shine
      </h1>

      <Link
        href="/shop"
        className="sois-hero-image"
        aria-label="Shop the new collection"
        style={{ position: "relative", display: "block", overflow: "hidden", background: "#10201d" }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              opacity: currentSlide === index ? 1 : 0,
              transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
              zIndex: currentSlide === index ? 1 : 0,
            }}
          >
            <Image
              src={slide}
              alt={
                index === 0
                  ? "Be yourself, own your shine — up to 15% off on all sterling silver jewellery"
                  : "Jewellery made to celebrate who you are"
              }
              fill
              priority={index === 0}
              sizes="100vw"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
            />
          </div>
        ))}

        {/* Carousel indicators */}
        <div style={{ position: "absolute", bottom: 24, right: 32, display: "flex", gap: 8, zIndex: 3 }}>
          {slides.map((_, index) => (
            <span
              key={index}
              onClick={(e) => {
                e.preventDefault();
                setCurrentSlide(index);
              }}
              style={{
                width: currentSlide === index ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: currentSlide === index ? "#115e59" : "rgba(255,255,255,0.7)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Link>
    </section>
  );
}
