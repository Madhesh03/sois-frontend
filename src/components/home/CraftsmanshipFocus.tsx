import Image from "next/image";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { I } from "@/lib/data";
import { T } from "@/lib/tokens";

export function CraftsmanshipFocus() {
  const specs = [
    { label: "Purity", detail: "925 sterling silver, hallmark-certified on every piece" },
    { label: "Certificate", detail: "BIS registered jeweller — Certificate No. HM/C-6790479812" },
    { label: "Assurance", detail: "Every piece marked with the purity symbol 925 or 92.5" },
  ];

  return (
    <section className="sois-section sois-craft" aria-labelledby="craft-heading">
      <div className="sois-craft-grid">
        <div className="sois-craft-img" style={{ background: "#10201d" }}>
          <Image
            className="craft-img-tile"
            src={I.bisCertificate}
            alt="SOIS BIS hallmark certificate of registration"
            fill
            sizes="(max-width: 767px) 100vw, 45vw"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div>
          <Eyebrow>CERTIFIED PURITY</Eyebrow>
          <h2
            id="craft-heading"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.ink, lineHeight: 1.1, marginBottom: 24 }}
          >
            BIS Hallmarked,
            <br />
            Pure Silver
          </h2>
          <p style={{ fontSize: "0.95rem", lineHeight: 1.9, color: T.muted, marginBottom: 40, maxWidth: 460 }}>
            Every SOIS piece is crafted in 925 sterling silver and carries the assurance of BIS hallmarking — so you always know exactly what you&apos;re wearing.
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
