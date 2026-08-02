# SOIS — Pre-launch & Razorpay Verification Checklist

The site is currently in **coming-soon mode**: `/` serves the pre-launch landing
page and the full storefront is parked at `/preview` (noindex).

---

## 1. Fill in the real business details — BLOCKING

Everything a payment gateway verifies lives in one file:
**[src/lib/business.ts](src/lib/business.ts)**

Replace every field marked `TODO`:

| Field | Why it matters |
|---|---|
| `legalName` | Must match the GST / PAN certificate **and** the Razorpay dashboard exactly |
| `entityType` | Proprietorship / Partnership / LLP / Pvt Ltd |
| `email` | Razorpay emails this address during review — must be monitored |
| `phone` + `phoneHref` | Razorpay **calls** this number. A dead or placeholder number is the #1 rejection reason |
| `address` | Full operating address; must match the dashboard |
| `gstin` / `cin` | Optional — leave `""` to hide the row, fill in to strengthen the application |
| `launchDate` | Drives the countdown. Set to `null` to hide it and show "Launching Soon" |

The current values (`support@soisstore.com`, `+91 98765 43210`, `No. 12 Anna
Salai…`) are **placeholders inherited from the prototype**. Submitting with
these will fail review.

## 2. Review the policy pages

Razorpay requires all four, and they are already routed and linked from the
coming-soon footer:

- [/privacy-policy](src/app/privacy-policy/page.tsx)
- [/terms](src/app/terms/page.tsx)
- [/refund-policy](src/app/refund-policy/page.tsx) — refund **and** cancellation terms
- [/shipping-policy](src/app/shipping-policy/page.tsx) — delivery timelines
- [/return-policy](src/app/return-policy/page.tsx), [/contact](src/app/contact/page.tsx) (also required: reachable contact details)

Read them end to end and make sure the stated timelines (refund window, delivery
SLA, return period) are ones the business can actually honour — Razorpay holds
merchants to what the site says.

## 3. Deploy checklist

- [ ] Point the domain in `siteConfig.url` ([src/lib/data.ts](src/lib/data.ts)) at the real domain
- [ ] Serve over **HTTPS** with a valid certificate (Razorpay rejects plain HTTP)
- [ ] Confirm `/`, all five policy routes and `/contact` load publicly, no auth wall
- [ ] `npm run build` passes
- [ ] Submit the URL for verification

## 4. Known gaps before submitting

- The **contact form** at `/contact` has no backend — it acknowledges locally
  and discards the message. Wire it to an inbox, or the email/phone on the page
  are the only real support channels.
- The **coming-soon enquiry form** posts to a SheetDB endpoint
  (`ENQUIRY_ENDPOINT` in [src/components/coming-soon/ComingSoon.tsx](src/components/coming-soon/ComingSoon.tsx)),
  which appends a row to a Google Sheet. Two caveats: the endpoint id sits in
  client-side code so anyone can write rows to that sheet, and nobody is
  notified — someone has to watch the sheet, or add a Sheets notification rule.
  The column headers must stay lower-case (`name`, `email`, `phone`, `message`)
  or SheetDB rejects every submission with "Bad data format".
- The **storefront routes remain publicly reachable** (`/shop`, `/category/*`,
  `/product/*`) — they're just out of the sitemap. This is usually helpful for
  verification (reviewers like seeing products and prices), but if you want a
  true hard "coming soon", gate them behind a middleware redirect to `/`.

---

## Going live

1. Move the body of [src/app/preview/page.tsx](src/app/preview/page.tsx) back into
   [src/app/page.tsx](src/app/page.tsx) and delete the preview route.
2. Restore the catalogue entries in [src/app/sitemap.ts](src/app/sitemap.ts)
   (`/shop`, `getCategories()`, `getAllProducts()` — see git history).
3. Optionally keep `ComingSoon` around for future campaigns.
