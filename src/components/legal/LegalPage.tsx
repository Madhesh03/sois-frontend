import Link from "next/link";
import { PolicyShell } from "@/components/legal/PolicyShell";
import { business, addressOneLine } from "@/lib/business";

/**
 * Shared layout for the static legal / policy pages. Renders the stripped-down
 * pre-launch chrome (no store nav), a titled page hero with a "last updated"
 * line, and a readable prose column. Pages pass their copy as children.
 */
export function LegalPage({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <PolicyShell>
      <section className="sois-page-hero sois-pol-hero">
        <div className="sois-page-hero-eyebrow">LEGAL &amp; POLICIES</div>
        <h1 className="sois-page-hero-title">{title}</h1>
        <p className="sois-legal-updated">Last updated: {updated}</p>
      </section>

      <article className="sois-legal">
        {intro && <p className="sois-legal-intro">{intro}</p>}
        {children}
        <p className="sois-legal-note">
          Questions about this policy? Write to{" "}
          <a href={`mailto:${business.email}`}>{business.email}</a> or{" "}
          <Link href="/contact">contact us</Link>. {business.legalName},{" "}
          {addressOneLine}.
        </p>
      </article>
    </PolicyShell>
  );
}
