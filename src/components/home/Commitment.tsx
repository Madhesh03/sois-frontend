import { ShieldCheck, Heart, Feather, Gem } from "lucide-react";

const FEATURES = [
  { icon: ShieldCheck, title: "925 Pure Sterling Silver", desc: "Genuine 92.5% sterling silver for premium quality and durability." },
  { icon: Heart, title: "Skin-Friendly", desc: "Nickel-free and gentle on sensitive skin for everyday wear." },
  { icon: Feather, title: "Lightweight Comfort", desc: "Light and effortless to wear, without compromising on style." },
  { icon: Gem, title: "Premium Plated Finish", desc: "High-quality plating for a luxurious, long-lasting look." },
];

export function Commitment() {
  return (
    <section className="sois-quality-wrap" aria-labelledby="commitment-heading">
      <div className="sois-quality">
        <div className="sois-quality-content">
          <div className="sois-quality-eyebrow">
            <span className="sois-quality-eyebrow-rule" aria-hidden="true" />
            CRAFTED FOR EVERYDAY ELEGANCE
          </div>
          <h2 id="commitment-heading" className="sois-quality-title">
            Quality You Can Feel
          </h2>
          <p className="sois-quality-intro">
            Every piece is thoughtfully designed to offer beauty, comfort, and
            lasting quality — crafted with care, so you can wear it with
            confidence every day.
          </p>

          <div className="sois-quality-grid">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="sois-quality-item">
                <span className="sois-quality-icon" aria-hidden="true">
                  <Icon size={26} strokeWidth={1.6} />
                </span>
                <div>
                  <h3 className="sois-quality-item-title">{title}</h3>
                  <p className="sois-quality-item-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
