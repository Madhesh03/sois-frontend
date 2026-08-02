import Link from "next/link";
import Image from "next/image";
import { business, addressOneLine } from "@/lib/business";

/**
 * Minimal chrome for the legal / policy / contact pages during pre-launch.
 *
 * Deliberately NOT the store shell: no header nav, no search, no cart or
 * account drawers, no marketing footer — nothing that routes a visitor into
 * the parked storefront. Only the wordmark (back to the landing page) and the
 * sibling policy links a payment gateway expects to find, plus the merchant's
 * contact details.
 */

const policyLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Shipping & Delivery", href: "/shipping-policy" },
  { label: "Returns", href: "/return-policy" },
  { label: "Contact Us", href: "/contact" },
];

export function PolicyShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="sois-pol">
      <header className="sois-pol-header">
        <Link href="/" className="sois-pol-logo" aria-label={`${business.brand} home`}>
          <Image
            src="/sois-logo.png"
            alt={business.brand}
            width={1106}
            height={402}
            priority
          />
          <span className="sois-pol-logo-sub">
            {business.tagline.toUpperCase()}
          </span>
        </Link>
      </header>

      <main id="main-content" className="sois-pol-main">
        {children}
      </main>

      <footer className="sois-pol-footer">
        <nav className="sois-pol-links" aria-label="Policies">
          {policyLinks.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="sois-pol-contact">
          <a href={`mailto:${business.email}`}>{business.email}</a>
          <span aria-hidden> • </span>
          <a href={`tel:${business.phoneHref}`}>{business.phone}</a>
          <span aria-hidden> • </span>
          {business.supportHours}
        </p>
        <p className="sois-pol-legal">
          © {new Date().getFullYear()} {business.legalName} · {addressOneLine}
        </p>
      </footer>
    </div>
  );
}
