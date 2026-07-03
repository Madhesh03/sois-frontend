import { T } from "@/lib/tokens";

const engravables = ["Names", "Dates", "Coordinates", "Messages"];

export function Personalisation() {
  return (
    <section className="sois-personalisation-wrap" aria-labelledby="personalisation-heading">
      <div className="sois-personalisation">
        <div className="sois-personalisation-content">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 20, height: 2, background: T.sage, flexShrink: 0 }} />
            <span style={{ fontSize: "0.62rem", letterSpacing: "0.28em", color: T.sage, fontWeight: 700 }}>MAKE IT YOURS</span>
          </div>
          <h2
            id="personalisation-heading"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.white, lineHeight: 1.1, marginBottom: 18 }}
          >
            Personalise Your
            <br />
            Silver Story
          </h2>
          <p style={{ fontSize: "0.93rem", color: "rgba(206,232,210,0.65)", lineHeight: 1.85, maxWidth: 460 }}>
            Engrave names, dates, coordinates, or a message that matters. Select pieces can be customised to order — delivered in 5–7 days with our signature gift wrap.
          </p>
          <div className="sois-personalisation-ctas">
            <a href="#" className="sois-touch-target sois-personalise-btn-primary">
              PERSONALISE NOW
            </a>
            <a href="#" className="sois-touch-target sois-personalise-btn-ghost">
              VIEW EXAMPLES
            </a>
          </div>
        </div>

        <div className="sois-personalise-preview" aria-hidden="true">
          <div className="sois-personalise-preview-head">
            <span className="sois-personalise-preview-label">ENGRAVING PREVIEW</span>
            <span className="sois-personalise-preview-dot" />
          </div>
          <div className="sois-personalise-plate">
            <span className="sois-personalise-plate-name">Ava</span>
            <span className="sois-personalise-plate-sub">24 · 05 · 2024</span>
          </div>
          <div className="sois-personalise-chips">
            {engravables.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
