import { Eyebrow } from "@/components/shared/Eyebrow";
import { T } from "@/lib/tokens";

export function Newsletter() {
  return (
    <section className="sois-newsletter-wrap" aria-labelledby="newsletter-heading">
      <div className="sois-newsletter">
        <div className="sois-newsletter-left">
          <Eyebrow>STAY IN THE LOOP</Eyebrow>
          <h2 id="newsletter-heading" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 800, letterSpacing: "-0.025em", color: T.forest, lineHeight: 1.1, marginBottom: 14 }}>
            Own Your
            <br />
            Shine
          </h2>
          <p style={{ fontSize: "0.9rem", color: T.muted, lineHeight: 1.8 }}>
            New arrivals, limited drops, care guides, and exclusive subscriber-only discounts — delivered weekly.
          </p>
        </div>
        <div className="sois-newsletter-right">
          <form className="sois-newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              aria-label="Email address"
              required
              style={{
                flex: 1,
                minWidth: 0,
                padding: "15px 20px",
                border: `1px solid ${T.sage}`,
                borderRight: "none",
                background: T.white,
                color: T.ink,
                fontSize: "0.9rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
            />
            <button
              type="submit"
              className="sois-touch-target"
              style={{
                background: T.forest,
                color: T.white,
                border: "none",
                padding: "15px 28px",
                fontSize: "0.7rem",
                letterSpacing: "0.14em",
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              SUBSCRIBE
            </button>
          </form>
          <p style={{ fontSize: "0.7rem", color: T.faint, lineHeight: 1.6 }}>
            By subscribing, you agree to receive marketing emails. Unsubscribe anytime. No spam, ever.
          </p>
          <div style={{ display: "flex", gap: 20, marginTop: 32, flexWrap: "wrap" }}>
            {["Instagram", "Pinterest", "WhatsApp"].map((s) => (
              <a
                key={s}
                href="#"
                style={{
                  fontSize: "0.7rem",
                  color: T.forest,
                  textDecoration: "none",
                  letterSpacing: "0.06em",
                  fontWeight: 700,
                  transition: "opacity 0.2s",
                  borderBottom: `1px solid ${T.sageDark}`,
                  paddingBottom: 1,
                }}
              >
                {s}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
