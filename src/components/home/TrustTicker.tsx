import { T } from "@/lib/tokens";

const items = [
  "925 STERLING SILVER GUARANTEED",
  "FREE SHIPPING ON ₹999+",
  "30-DAY HASSLE-FREE RETURNS",
  "HALLMARKED & CERTIFIED",
  "10,000+ HAPPY CUSTOMERS",
  "LIFETIME SHINE GUARANTEE",
  "SUSTAINABLY CRAFTED",
  "GIFT-READY PACKAGING",
];

export function TrustTicker() {
  const repeated = [...items, ...items, ...items, ...items];

  return (
    <div
      className="sois-ticker"
      role="marquee"
      aria-label="Store benefits"
      style={{
        background: T.forest,
        color: T.sage,
        height: 38,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div className="ticker-track" style={{ display: "flex", gap: 0, whiteSpace: "nowrap", willChange: "transform" }}>
        {repeated.map((item, i) => (
          <span
            key={i}
            style={{
              fontSize: "0.64rem",
              letterSpacing: "0.18em",
              fontWeight: 700,
              padding: "0 36px",
              borderRight: `1px solid rgba(206,232,210,0.25)`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
