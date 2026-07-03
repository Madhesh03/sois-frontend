import { T } from "@/lib/tokens";

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="sois-eyebrow" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
      <div style={{ width: 20, height: 2, background: T.forest, flexShrink: 0 }} />
      <span style={{ fontSize: "0.62rem", letterSpacing: "0.28em", color: T.forest, fontWeight: 700 }}>
        {children}
      </span>
    </div>
  );
}
