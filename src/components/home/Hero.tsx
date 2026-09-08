"use client";

import Image from "next/image";
import Link from "next/link";
import { I } from "@/lib/data";

export function Hero() {
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
        <Image
          src={I.heroBanner}
          alt="Jewellery made to celebrate who you are"
          fill
          priority
          sizes="100vw"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </Link>
    </section>
  );
}
