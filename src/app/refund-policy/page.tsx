import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "How and when SOIS issues refunds for returned or cancelled sterling silver jewellery orders.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="2 July 2026"
      intro="This policy explains how refunds are processed for eligible returns and cancellations."
    >
      <h2>Refund Eligibility</h2>
      <p>
        Refunds are issued for approved returns that meet the conditions in our{" "}
        <a href="/return-policy">Return Policy</a>, and for orders cancelled
        before they are dispatched.
      </p>

      <h2>Refund Method</h2>
      <p>
        Approved refunds are credited to your original payment method. If that
        is not possible, we will coordinate an alternative such as store credit.
      </p>

      <h2>Processing Time</h2>
      <ul>
        <li>
          Refunds are initiated within 3–5 business days of us receiving and
          inspecting your returned item.
        </li>
        <li>
          It may take an additional 5–7 business days for the amount to reflect
          in your account, depending on your bank or payment provider.
        </li>
      </ul>

      <h2>Order Cancellations</h2>
      <p>
        You can cancel an order before it is shipped for a full refund. Once an
        order has been dispatched, our return process applies instead.
      </p>

      <h2>Shipping Charges</h2>
      <p>
        Shipping is free on all orders, so there are no shipping charges to
        refund. Refunds cover the item amount you paid.
      </p>

      <h2>Late or Missing Refunds</h2>
      <p>
        If you haven’t received your refund within the expected time, please
        first check with your bank or payment provider. If you still need help,
        contact us at <a href="mailto:support@soisstore.com">support@soisstore.com</a>.
      </p>
    </LegalPage>
  );
}
