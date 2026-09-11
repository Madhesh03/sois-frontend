import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description:
    "Shipping timelines, charges, and delivery information for SOIS sterling silver jewellery orders.",
};

export default function ShippingPolicyPage() {
  return (
    <LegalPage
      title="Shipping Policy"
      updated="2 July 2026"
      intro="We want your SOIS jewellery to reach you safely and on time. This policy explains how we process, ship, and deliver your orders."
    >
      <h2>Order Processing</h2>
      <p>
        Orders are processed within 24–48 business hours of payment
        confirmation. You will receive a confirmation email once your order is
        placed, and a tracking link once it ships.
      </p>

      <h2>Delivery Timelines</h2>
      <ul>
        <li>Metro cities: 2–4 business days</li>
        <li>Other locations: 4–7 business days</li>
        <li>
          Delivery times are estimates and may vary during sale periods or due
          to courier delays.
        </li>
      </ul>

      <h2>Shipping Charges</h2>
      <p>
        We offer <strong>free shipping on all orders</strong>, with no minimum
        order value. The price you see at checkout is the price you pay — there
        are no shipping fees added.
      </p>

      <h2>Order Tracking</h2>
      <p>
        Once your order is dispatched, you can track its progress from your{" "}
        account under “My Orders”, or via the tracking link sent to your email.
      </p>

      <h2>Delivery Issues</h2>
      <p>
        If your order is delayed or marked as delivered but not received,
        please contact us within 48 hours of the delivery date so we can help
        resolve it quickly. If your order arrives damaged, defective,
        incorrect or incomplete, see our{" "}
        <Link href="/return-policy">Returns, Refunds &amp; Exchange Policy</Link>{" "}
        — a mandatory unboxing video is required for any such claim.
      </p>

      <h2>Serviceable Areas</h2>
      <p>
        We currently ship across India. International shipping is not available
        in this phase but is planned for the future.
      </p>
    </LegalPage>
  );
}
