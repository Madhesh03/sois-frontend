import Image from "next/image";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function Commitment() {
  const pillars = [
    { icon: "⬡", title: "Hallmarked 925", desc: "Every single piece is independently certified to 925 sterling silver purity. No exceptions." },
    { icon: "◈", title: "Anti-Tarnish Coated", desc: "Our proprietary coating keeps your silver bright for years of daily wear, no matter your skin chemistry." },
    { icon: "↺", title: "30-Day Returns", desc: "Not in love? Return or exchange anything within 30 days — no questions, no fuss, full refund." },
    { icon: "⊕", title: "Gift-Ready Always", desc: "Every order ships in our signature box with a ribbon and a personalised note. Ready to gift instantly." },
  ];

  return (
    <section className="sois-section sois-commitment" aria-labelledby="commitment-heading">
      <div className="sois-stats-strip">
        {[["925", "Sterling Purity"], ["500+", "Designs"], ["10k+", "Wearers"], ["Lifetime", "Shine Guarantee"]].map(([num, lbl]) => (
          <div key={lbl} className="sois-stat-cell">
            <div style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, color: T.forest, letterSpacing: "-0.03em", lineHeight: 1 }}>{num}</div>
            <div style={{ fontSize: "0.68rem", color: T.faint, marginTop: 10, letterSpacing: "0.08em", fontWeight: 600 }}>{lbl.toUpperCase()}</div>
          </div>
        ))}
      </div>

      <div className="sois-commitment-grid">
        <div className="sois-commitment-mosaic">
          <div className="sois-mosaic-main" style={{ position: "relative", overflow: "hidden" }}>
            <Image src={I.commitmentMain} alt="SOIS jeweller hand-finishing a sterling silver piece" fill sizes="(max-width: 767px) 100vw, 25vw" style={{ objectFit: "cover", objectPosition: "center" }} />
          </div>
          <div className="sois-mosaic-secondary" style={{ position: "relative", overflow: "hidden" }}>
            <Image src={I.necklace} alt="Silver necklace" fill sizes="(max-width: 767px) 50vw, 25vw" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6 }}>
            <Image src={I.commitmentTexture} alt="Macro detail of hand-polished sterling silver" fill sizes="(max-width: 767px) 50vw, 25vw" style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(17,94,89,0.82) 0%, rgba(10,20,20,0.55) 100%)" }} />
            <div style={{ position: "relative", fontSize: "2.2rem", fontWeight: 800, color: T.sage, letterSpacing: "-0.03em" }}>925</div>
            <div style={{ position: "relative", fontSize: "0.6rem", color: "rgba(206,232,210,0.75)", letterSpacing: "0.2em", fontWeight: 700 }}>STERLING</div>
          </div>
        </div>

        <div>
          <Eyebrow>OUR PROMISE</Eyebrow>
          <h2 id="commitment-heading" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.1, marginBottom: 24 }}>
            Quality You
            <br />
            Can Feel
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 48 }}>
            We believe jewellery should be a daily companion, not a special-occasion relic. Every SOIS piece is built to be worn, loved, and passed down — backed by materials and craftsmanship that earn that kind of trust.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {pillars.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                style={{
                  padding: "22px 0",
                  borderTop: `1px solid ${T.sage}`,
                  borderBottom: i === pillars.length - 1 ? `1px solid ${T.sage}` : "none",
                  display: "grid",
                  gridTemplateColumns: "36px 1fr",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div style={{ fontSize: "1.1rem", color: T.forest, marginTop: 2 }}>{icon}</div>
                <div>
                  <div style={{ fontSize: "0.86rem", fontWeight: 700, color: T.ink, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: "0.8rem", color: T.muted, lineHeight: 1.7 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
