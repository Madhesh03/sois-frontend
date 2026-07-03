import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";

/**
 * Shared layout for the static legal / policy pages. Renders the standard store
 * chrome, a titled page hero with breadcrumb + "last updated" line, and a
 * readable prose column. Pages pass their copy as children.
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
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">{title}</span>
        </nav>
        <div className="sois-page-hero-eyebrow">LEGAL &amp; POLICIES</div>
        <h1 className="sois-page-hero-title">{title}</h1>
        <p className="sois-legal-updated">Last updated: {updated}</p>
      </section>

      <article className="sois-legal">
        {intro && <p className="sois-legal-intro">{intro}</p>}
        {children}
        <p className="sois-legal-note">
          This document is a template provided for the SOIS platform and should
          be reviewed and approved by SOIS before publication. For any questions,{" "}
          <Link href="/contact">contact us</Link>.
        </p>
      </article>
    </StoreShell>
  );
}
