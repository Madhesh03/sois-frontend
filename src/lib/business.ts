/**
 * Single source of truth for the business / merchant details that payment
 * gateways (Razorpay) and marketplaces verify against the website.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * ⚠️  BEFORE SUBMITTING FOR RAZORPAY VERIFICATION
 * Every field marked TODO below must be replaced with the REAL registered
 * details. Razorpay's review team calls the phone number and emails the
 * address — placeholder values are the single most common rejection reason,
 * and the details here must match the ones entered in the Razorpay dashboard
 * exactly (legal name, address, GSTIN).
 * ─────────────────────────────────────────────────────────────────────────
 */
export const business = {
  /** Consumer-facing brand name. */
  brand: "SOIS",
  tagline: "Sterling Silver Jewellery",

  /** TODO: registered legal entity, exactly as on the GST / PAN certificate. */
  legalName: "SOIS Jewellery",
  /** Proprietorship | Partnership | LLP | Private Limited */
  entityType: "Proprietorship",

  /** TODO: real, monitored inbox. Avoid free personal addresses if possible. */
  email: "support@soisstore.com",
  /** TODO: real, reachable number — Razorpay's team calls this. */
  phone: "+91 98765 43210",
  /** E.164 form used for tel: / wa.me links. */
  phoneHref: "+919876543210",
  supportHours: "Monday – Saturday, 10:00 AM – 7:00 PM IST",

  /** TODO: full operating address, matching the Razorpay dashboard. */
  address: {
    line1: "No. 12, Anna Salai",
    line2: "Nungambakkam",
    city: "Chennai",
    state: "Tamil Nadu",
    postalCode: "600034",
    country: "India",
  },

  /** TODO: add once available — leave empty to hide the row. */
  gstin: "",
  cin: "",

  /** Plain-language description of what is sold. Verification teams read this. */
  description:
    "SOIS retails hallmarked 925 sterling silver jewellery online across India — rings, earrings, necklaces, bracelets, anklets and gift sets. Every piece is nickel-free, rhodium-finished and shipped with an authenticity card.",

  /** Indicative pricing — gateways require price transparency before approval. */
  priceRange: { min: 749, max: 4999, currency: "INR" },

  /**
   * Expected launch. Set to null to hide the countdown and show a
   * "launching soon" line instead. Month is 0-indexed (9 = October).
   */
  launchDate: new Date(2026, 9, 1, 10, 0, 0),

  social: {
    instagram: "https://instagram.com/soisjewellery",
  },
} as const;

export const addressOneLine = [
  business.address.line1,
  business.address.line2,
  `${business.address.city} ${business.address.postalCode}`,
  business.address.state,
  business.address.country,
]
  .filter(Boolean)
  .join(", ");

/** Product lines shown on the coming-soon page, with indicative price bands. */
export const upcomingCategories = [
  { name: "Rings", from: 899 },
  { name: "Earrings", from: 749 },
  { name: "Necklaces", from: 1299 },
  { name: "Bracelets", from: 999 },
  { name: "Anklets", from: 1099 },
  { name: "Gift Sets", from: 1899 },
] as const;
