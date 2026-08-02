import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon/ComingSoon";
import { business, addressOneLine } from "@/lib/business";
import { siteConfig } from "@/lib/data";

/**
 * Pre-launch landing page. The full storefront lives at /preview until launch —
 * to go live, swap this file's body back to the <HomePage /> render (see
 * src/app/preview/page.tsx) and delete the preview route.
 */
export const metadata: Metadata = {
  title: `${siteConfig.name} — Launching Soon | Hallmarked 925 Sterling Silver Jewellery`,
  description: business.description,
  alternates: { canonical: siteConfig.url },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Launching Soon`,
    description: business.description,
  },
};

// Organization + LocalBusiness schema. Payment gateways and search crawlers
// both read this to confirm the site belongs to a real, contactable merchant.
const structuredData = {
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  name: business.brand,
  legalName: business.legalName,
  url: siteConfig.url,
  description: business.description,
  email: business.email,
  telephone: business.phoneHref,
  address: {
    "@type": "PostalAddress",
    streetAddress: [business.address.line1, business.address.line2]
      .filter(Boolean)
      .join(", "),
    addressLocality: business.address.city,
    addressRegion: business.address.state,
    postalCode: business.address.postalCode,
    addressCountry: "IN",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: business.email,
    telephone: business.phoneHref,
    areaServed: "IN",
    availableLanguage: ["en", "ta"],
  },
  sameAs: [business.social.instagram],
  priceRange: `₹${business.priceRange.min}–₹${business.priceRange.max}`,
  ...(business.gstin ? { taxID: business.gstin } : {}),
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Plain-text address kept in the DOM for automated verification crawls. */}
      <span style={{ display: "none" }}>{addressOneLine}</span>
      <ComingSoon />
    </>
  );
}
