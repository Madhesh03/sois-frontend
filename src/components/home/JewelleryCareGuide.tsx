import { SprayCan, Waves, Sparkles, Package } from "lucide-react";
import { T } from "@/lib/tokens";

const CARE_TIPS = [
  {
    icon: SprayCan,
    text: "Keep away from perfumes, lotions, hairsprays, and chemicals.",
  },
  {
    icon: Waves,
    text: "Remove before swimming, bathing, exercising, or sleeping.",
  },
  {
    icon: Sparkles,
    text: "Wipe gently with a SOIS soft polishing cloth after each use.",
  },
  {
    icon: Package,
    text: "Store in the SOIS zip pouch when not in use.",
  },
];

export function JewelleryCareGuide() {
  return (
    <section className="sois-care-wrap" aria-labelledby="care-guide-heading">
      <div className="sois-care">
        <div className="sois-care-content">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 2, background: T.sage, flexShrink: 0 }} />
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.28em", color: T.sage, fontWeight: 700 }}>CARE GUIDE</span>
          </div>
          <h2
            id="care-guide-heading"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.white, lineHeight: 1.1, marginBottom: 14 }}
          >
            Jewellery Care Guide
          </h2>
          <p className="sois-care-sub" style={{ fontSize: "0.93rem", color: "rgba(206,232,210,0.65)", lineHeight: 1.7, maxWidth: 480, margin: "0 auto" }}>
            To keep your SOIS jewellery beautiful for years.
          </p>

          <div className="sois-care-grid">
            {CARE_TIPS.map(({ icon: Icon, text }) => (
              <div key={text} className="sois-care-item">
                <span className="sois-care-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.6} />
                </span>
                <p className="sois-care-text">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
