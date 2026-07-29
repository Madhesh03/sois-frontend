import { Droplets, Waves, Dumbbell, Moon, Sparkles, Package } from "lucide-react";
import { T } from "@/lib/tokens";

const CARE_TIPS = [
  { icon: Droplets, title: "Avoid Water & Chemicals", desc: "Keep away from water, perfume, lotions & chemicals." },
  { icon: Waves, title: "Swimming & Bathing", desc: "Remove your jewellery before swimming or bathing." },
  { icon: Dumbbell, title: "Workouts & Sports", desc: "Remove your jewellery before workouts or sports." },
  { icon: Moon, title: "While Sleeping", desc: "Do not wear your jewellery while sleeping." },
  { icon: Sparkles, title: "Wipe After Each Use", desc: "Wipe gently with a SOIS soft cloth after each use." },
  { icon: Package, title: "Store It Safely", desc: "Store in the SOIS zip pouch when not in use." },
];

export function JewelleryCareGuide() {
  return (
    <section className="sois-section sois-care" aria-labelledby="care-guide-heading">
      <div className="sois-care-head">
        <div className="sois-care-eyebrow">
          <span className="sois-care-eyebrow-rule" aria-hidden="true" />
          CARE GUIDE
        </div>
        <h2 id="care-guide-heading" className="sois-care-title">
          Jewellery Care Guide
        </h2>
        <p className="sois-care-intro">
          To keep your SOIS jewellery beautiful for years.
        </p>
      </div>

      <div className="sois-care-grid">
        {CARE_TIPS.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="sois-care-card">
            <span className="sois-care-icon" aria-hidden="true">
              <Icon size={22} strokeWidth={1.7} color={T.forest} />
            </span>
            <h3 className="sois-care-card-title">{title}</h3>
            <p className="sois-care-card-desc">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
