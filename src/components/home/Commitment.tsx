import { ShieldCheck, Heart, Feather, Sparkles, Gem } from "lucide-react";
import { T } from "@/lib/tokens";

const FEATURES = [
  { icon: ShieldCheck, title: "925 Pure Sterling Silver", desc: "Genuine 92.5% sterling silver for premium quality and durability." },
  { icon: Heart, title: "Skin-Friendly", desc: "Nickel-free and gentle on sensitive skin for everyday wear." },
  { icon: Feather, title: "Lightweight Comfort", desc: "Light and effortless to wear, without compromising on style." },
  { icon: Sparkles, title: "Tarnish-Resistant", desc: "A protective coating helps maintain its shine with proper care." },
  { icon: Gem, title: "Premium Plated Finish", desc: "High-quality plating for a luxurious, long-lasting look." },
];

const STATS: [string, string][] = [
  ["925", "Sterling Purity"],
  ["500+", "Designs"],
  ["10k+", "Wearers"],
  ["Lifetime", "Shine Guarantee"],
];

export function Commitment() {
  return (
    <section className="sois-section sois-quality" aria-labelledby="commitment-heading">
      <div className="sois-quality-head">
        <div className="sois-quality-eyebrow">
          <span className="sois-quality-eyebrow-rule" />
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
      </div>

      <div className="sois-quality-grid">
        {FEATURES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="sois-quality-card">
            <span className="sois-quality-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.7} color={T.forest} />
            </span>
            <h3 className="sois-quality-card-title">{title}</h3>
            <p className="sois-quality-card-desc">{desc}</p>
          </div>
        ))}
      </div>

      <div className="sois-quality-stats">
        {STATS.map(([num, lbl]) => (
          <div key={lbl} className="sois-quality-stat">
            <span className="sois-quality-stat-num">{num}</span>
            <span className="sois-quality-stat-lbl">{lbl.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
