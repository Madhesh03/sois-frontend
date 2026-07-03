import Image from "next/image";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function CraftsmanshipFocus() {
  const specs = [
    { label: "Material", detail: "925 sterling silver, hallmark-certified on every piece" },
    { label: "Finish", detail: "Hand-polished and sealed with an anti-tarnish coating" },
    { label: "Exclusivity", detail: "Small-batch runs, designed and finished in-house" },
  ];

  return (
    <section className="sois-section sois-craft" aria-labelledby="craft-heading">
      <div className="sois-craft-grid">
        <div className="sois-craft-img">
          <Image
            className="craft-img-tile"
            src={I.craftClose}
            alt="Close-up detail of SOIS sterling silver craftsmanship"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div>
          <Eyebrow>CRAFTSMANSHIP</Eyebrow>
          <h2
            id="craft-heading"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.1, marginBottom: 24 }}
          >
            Every Detail,
            <br />
            Considered
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 40, maxWidth: 460 }}>
            From alloy to finish, each piece passes through hands that care about the millimetre. Nothing ships until it meets our own bar for quality.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {specs.map(({ label, detail }, i) => (
              <div
                key={label}
                style={{
                  padding: "20px 0",
                  borderTop: `1px solid ${T.sage}`,
                  borderBottom: i === specs.length - 1 ? `1px solid ${T.sage}` : "none",
                  display: "grid",
                  gridTemplateColumns: "130px 1fr",
                  gap: 16,
                  alignItems: "start",
                }}
              >
                <div style={{ fontSize: "0.68rem", letterSpacing: "0.14em", fontWeight: 700, color: T.forest, marginTop: 2 }}>
                  {label.toUpperCase()}
                </div>
                <div style={{ fontSize: "0.85rem", color: T.muted, lineHeight: 1.7 }}>{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
