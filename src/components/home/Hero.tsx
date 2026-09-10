"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { I } from "@/lib/data";

export function Hero() {
  const slides = I.heroBannerSlides;
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="sois-hero" aria-labelledby="hero-heading">
      <h1 id="hero-heading" className="sois-sr-only">
        Jewellery made to celebrate who you are
      </h1>

      <Link
        href="/shop"
        className="sois-hero-image"
        aria-label="Shop the new collection"
        style={{ position: "relative", display: "block", overflow: "hidden", background: "#10201d" }}
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

        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: 20,
            transform: "translateX(-50%)",
            display: "flex",
            gap: 8,
            zIndex: 2,
          }}
        >
          {slides.map((src, i) => (
            <span
              key={src}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: i === active ? "#fff" : "rgba(255,255,255,0.45)",
                transition: "background 0.3s",
              }}
            />
          ))}
        </div>
      </Link>
    </section>
  );
}
