import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Return Policy",
  description:
    "How to return your SOIS sterling silver jewellery, eligibility, and the returns process.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage
      title="Return Policy"
      updated="2 July 2026"
      intro="We want you to love your SOIS jewellery. If something isn’t right, our returns process makes it easy to send items back within 30 days of delivery."
    >
      <h2>Return Window</h2>
      <p>
        You may request a return within <strong>30 days</strong> of receiving
        your order, provided the item meets our eligibility conditions below.
      </p>

      <h2>Eligibility</h2>
      <ul>
        <li>The item must be unused, unworn, and in its original condition</li>
        <li>Original packaging, tags, and the anti-tarnish pouch must be included</li>
        <li>Proof of purchase (order number) is required</li>
      </ul>

      <h2>Non-Returnable Items</h2>
      <ul>
        <li>Customised or engraved pieces</li>
        <li>Items marked as final sale</li>
        <li>Gift cards</li>
      </ul>

      <h2>How to Return</h2>
      <ol>
        <li>
          Contact us at <a href="mailto:hello@sois.in">hello@sois.in</a> with
          your order number and reason for return.
        </li>
        <li>Our team will share a return authorisation and instructions.</li>
        <li>Pack the item securely with all original packaging.</li>
        <li>
          Once we receive and inspect the item, we’ll confirm your refund or
          exchange.
        </li>
      </ol>

      <h2>Exchanges</h2>
      <p>
        If you’d like a different size or style, let us know and we’ll help
        arrange an exchange, subject to availability.
      </p>

      <p>
        Refunds for approved returns are handled per our{" "}
        <a href="/refund-policy">Refund Policy</a>.
      </p>
    </LegalPage>
  );
}
