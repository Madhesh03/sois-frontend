import Image from "next/image";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function EditorialBreak() {
  return (
    <section className="sois-editorial" aria-labelledby="editorial-heading">
      <Image
        src={I.editorial}
        alt="SOIS editorial campaign"
        fill
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 20%", filter: "brightness(0.45) contrast(1.1)" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(29,54,56,0.35)", mixBlendMode: "multiply" }} />
      <div
        className="sois-editorial-content"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          textAlign: "center",
          padding: "0 24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ width: 36, height: 1, background: T.sage }} />
          <span style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: T.sage, fontWeight: 700 }}>
            SUMMER COLLECTION · 2026
          </span>
          <div style={{ width: 36, height: 1, background: T.sage }} />
        </div>
        <h2
          id="editorial-heading"
          style={{
            fontSize: "clamp(2rem, 6vw, 5.5rem)",
            fontWeight: 800,
            color: T.white,
            letterSpacing: "-0.02em",
            lineHeight: 1.0,
            marginBottom: 32,
          }}
        >
          Silver Is
          <br />
          The New Gold
        </h2>
        <a
          href="/shop"
          className="sois-touch-target"
          style={{
            background: T.sage,
            color: T.forest,
            padding: "15px 40px",
            fontSize: "0.74rem",
            letterSpacing: "0.14em",
            fontWeight: 800,
            textDecoration: "none",
            transition: "all 0.22s",
          }}
        >
          EXPLORE THE COLLECTION
        </a>
      </div>
    </section>
  );
}
