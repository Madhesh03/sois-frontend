"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function Hero() {
  const slides = [I.heroModel, I.heroSlide2, I.heroSlide3];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="sois-hero" aria-labelledby="hero-heading">
      <div className="sois-hero-text" style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "72px 64px 72px 72px", position: "relative", background: T.white }}>
        <Eyebrow>STERLING SILVER JEWELLERY · EST. 2024</Eyebrow>

        <h1
          id="hero-heading"
          style={{
            fontSize: "clamp(2.4rem, 5vw, 5rem)",
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: T.ink,
            marginBottom: 0,
            marginTop: 8,
          }}
        >
          Be Yourself,
          <br />
          <span style={{ color: T.forest }}>Own Your Shine</span>
        </h1>

        <p
          className="sois-hero-desc"
          style={{
            fontSize: "1.05rem",
            lineHeight: 1.85,
            color: T.muted,
            maxWidth: 360,
            marginTop: 24,
            marginBottom: 52,
            fontWeight: 400,
          }}
        >
          925 sterling silver pieces designed for the modern wardrobe — from everyday essentials to statement pieces crafted to outlast every trend.
        </p>

        <div className="sois-hero-ctas" style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 64, flexWrap: "wrap" }}>
          <a
            href="#"
            className="sois-touch-target sois-hero-cta-primary"
            style={{
              background: T.forest,
              color: T.white,
              padding: "16px 36px",
              fontSize: "0.74rem",
              letterSpacing: "0.14em",
              fontWeight: 700,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            SHOP NOW <ArrowRight size={13} />
          </a>
          <a
            href="#"
            className="sois-touch-target sois-hero-cta-secondary"
            style={{
              color: T.forest,
              padding: "16px 28px",
              fontSize: "0.74rem",
              letterSpacing: "0.12em",
              fontWeight: 600,
              textDecoration: "none",
              border: `1px solid ${T.sageDark}`,
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "transparent",
            }}
          >
            <Play size={12} fill={T.forest} color={T.forest} /> View Lookbook
          </a>
        </div>
      </div>

      <div className="sois-hero-image" style={{ position: "relative", overflow: "hidden", background: T.surface }}>
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
              zIndex: currentSlide === index ? 1 : 0
            }}
          >
            <Image
              src={slide}
              alt={`Woman wearing SOIS sterling silver jewellery - slide ${index + 1}`}
              fill
              priority={index === 0}
              sizes="(max-width: 767px) 100vw, 50vw"
              style={{
                objectFit: "cover",
                objectPosition: "center top",
                transform: currentSlide === index ? "scale(1.08)" : "scale(1)",
                transition: "transform 6.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          </div>
        ))}
        
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "35%",
            background: "linear-gradient(to top, rgba(17,94,89,0.12) 0%, transparent 100%)",
            zIndex: 2,
          }}
        />

        <div
          className="sois-hero-featured"
          style={{
            display: "none",
            position: "absolute",
            top: 40,
            right: 40,
            background: "rgba(255,255,255,0.96)",
            backdropFilter: "blur(14px)",
            padding: "18px 22px",
            boxShadow: "0 12px 40px rgba(17,94,89,0.18)",
            maxWidth: 220,
            borderTop: `3px solid ${T.sage}`,
            borderRadius: "2px",
            zIndex: 3,
          }}
        >
          <div style={{ fontSize: "0.58rem", letterSpacing: "0.2em", color: T.forest, fontWeight: 700, marginBottom: 7 }}>
            FEATURED PIECE
          </div>
          <div style={{ fontSize: "0.88rem", fontWeight: 700, color: T.ink, marginBottom: 4 }}>Crescent Moon Pendant</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.82rem", color: T.muted }}>₹1,299</span>
            <button
              type="button"
              className="sois-touch-target sois-hero-featured-add"
              style={{
                background: T.forest,
                color: T.white,
                border: "none",
                padding: "7px 14px",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              ADD
            </button>
          </div>
        </div>

        <div
          className="sois-hero-tag"
          style={{
            position: "absolute",
            bottom: 44,
            left: -1,
            background: T.forest,
            color: T.sage,
            padding: "12px 24px",
            fontSize: "0.62rem",
            letterSpacing: "0.2em",
            fontWeight: 700,
            zIndex: 3,
          }}
        >
          NEW COLLECTION &apos;26
        </div>

        {/* Carousel indicators */}
        <div style={{ position: "absolute", bottom: 24, right: 32, display: "flex", gap: 8, zIndex: 3 }}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              style={{
                width: currentSlide === index ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: currentSlide === index ? T.forest : "rgba(255,255,255,0.7)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

