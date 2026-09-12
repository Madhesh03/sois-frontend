"use client";

import { useEffect, useState } from "react";

/** Launch moment — 13 Sep 2026, 11:00 IST (05:30 UTC). */
const LAUNCH_ISO = "2026-09-13T05:30:00.000Z";

function split(msLeft: number) {
  const total = Math.max(0, Math.floor(msLeft / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

export function Countdown() {
  // Null until the first client tick. The remaining time is read off the
  // viewer's own clock, so committing to any value during SSR would render
  // markup the client immediately disagrees with — a hydration mismatch.
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(LAUNCH_ISO).getTime();
    const tick = () => setLeft(target - Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // nginx swaps this page for the storefront at the same moment the clock
  // runs out, so reloading is what actually reveals the shop to anyone who
  // sat watching the countdown. The delay covers small clock differences
  // between the viewer and the server.
  useEffect(() => {
    if (left === null || left > 0) return;
    const id = setTimeout(() => window.location.reload(), 3000);
    return () => clearTimeout(id);
  }, [left]);

  if (left === null) {
    // Reserve the strip's height so the headline above it doesn't jump when
    // the first tick lands.
    return <div className="sois-cs-count sois-cs-count-empty" aria-hidden />;
  }

  if (left <= 0) {
    return (
      <div className="sois-cs-count">
        <p className="sois-cs-count-live">The doors are open — welcome in…</p>
      </div>
    );
  }

  const { days, hours, minutes, seconds } = split(left);
  const cells = [
    ...(days > 0 ? [{ unit: days === 1 ? "Day" : "Days", value: days }] : []),
    { unit: "Hours", value: hours },
    { unit: "Minutes", value: minutes },
    { unit: "Seconds", value: seconds },
  ];

  return (
    <div className="sois-cs-count">
      <p className="sois-cs-count-label">Opening In</p>
      <div className="sois-cs-count-row">
        {cells.map(({ unit, value }, i) => (
          <div key={unit} className="sois-cs-count-cell">
            {i > 0 && <span className="sois-cs-count-sep" aria-hidden />}
            <span className="sois-cs-count-num">
              {String(value).padStart(2, "0")}
            </span>
            <span className="sois-cs-count-unit">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
