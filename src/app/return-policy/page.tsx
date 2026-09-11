import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Returns, Refunds & Exchange Policy",
  description:
    "SOIS Returns, Refunds & Exchange Policy — order cancellation, the mandatory unboxing video requirement, and how damaged, defective, incorrect, or missing items are handled.",
};

export default function ReturnPolicyPage() {
  return (
    <LegalPage
      title="Returns, Refunds & Exchange Policy"
      updated="11 September 2026"
      intro="At SOIS, every jewellery piece is carefully inspected and securely packed with love and care before being shipped to you. We want you to receive your order in perfect condition. Please read the following policy carefully before placing your order."
    >
      <h2>1. Order Cancellation</h2>
      <p>Once an order has been successfully placed, it cannot be cancelled or modified.</p>
      <p>
        As our orders may be processed for packing and shipping shortly after
        being placed, cancellation requests cannot be accepted once the order
        is confirmed.
      </p>
      <p>
        Please carefully check your product, size, quantity, shipping address
        and other order details before completing your purchase.
      </p>

      <h2>2. Unboxing Video Is Mandatory</h2>
      <p>
        For any claim related to a damaged, defective, incorrect, missing or
        incomplete product, an unboxing video is mandatory.
      </p>
      <p>The unboxing video must:</p>
      <ul>
        <li>Be recorded continuously from the moment the package is received and before opening it.</li>
        <li>Clearly show the outer packaging and shipping label.</li>
        <li>Show the package being opened for the first time.</li>
        <li>Clearly show the jewellery and all items received inside the package.</li>
        <li>Not be edited, cut or otherwise altered.</li>
      </ul>
      <p>
        Without a valid unboxing video, SOIS will not be able to process a
        refund, return or exchange request. This requirement helps us verify
        the condition of the package and product at the time of delivery.
      </p>

      <h2>3. Damaged or Defective Product</h2>
      <p>
        If your jewellery arrives damaged or defective, please contact SOIS
        within <strong>48 hours of delivery</strong> with:
      </p>
      <ul>
        <li>Your order number.</li>
        <li>A clear description of the issue.</li>
        <li>Clear photographs of the product and packaging.</li>
        <li>The complete, uninterrupted unboxing video.</li>
      </ul>
      <p>
        After reviewing the submitted information, our team will determine
        whether the product qualifies for a return, refund or exchange.
      </p>

      <h2>4. Incorrect or Missing Product</h2>
      <p>
        If you receive an incorrect product, incorrect quantity, or an item
        is missing from your order, please contact us within{" "}
        <strong>48 hours of delivery</strong>.
      </p>
      <p>A complete unboxing video is mandatory for us to investigate and process such claims.</p>
      <p>
        If the issue is verified, SOIS may provide a replacement, exchange or
        refund, depending on the circumstances and availability.
      </p>

      <h2>5. Exchange Policy</h2>
      <p>Exchange requests are accepted only for eligible products and subject to approval by SOIS.</p>
      <p>The product must be:</p>
      <ul>
        <li>Unused and unworn.</li>
        <li>In its original condition.</li>
        <li>Returned with the original packaging and accessories.</li>
        <li>Free from scratches, damage, stains or signs of use.</li>
      </ul>
      <p>
        An unboxing video may also be required to verify the original
        condition of the product received. Products that have been worn,
        altered, damaged or improperly handled may not be eligible for
        exchange.
      </p>

      <h2>6. Refund Policy</h2>
      <p>Refunds are issued only for eligible cases approved by SOIS after verification.</p>
      <p>
        If a refund is approved, it will be processed through the applicable
        payment method or according to the refund procedure communicated by
        SOIS. Refund processing time may vary depending on the payment
        provider or bank.
      </p>

      <h2>7. Non-Returnable / Non-Exchangeable Situations</h2>
      <p>Returns or exchanges may not be accepted for:</p>
      <ul>
        <li>Change of mind.</li>
        <li>Incorrect size selected by the customer.</li>
        <li>Products that have been worn or used.</li>
        <li>Products damaged after delivery due to customer handling.</li>
        <li>Scratched, altered or tampered jewellery.</li>
        <li>Missing original packaging or accessories.</li>
        <li>Claims submitted without the required unboxing video.</li>
        <li>Requests submitted after the specified claim period.</li>
      </ul>

      <h2>8. Return Shipping</h2>
      <p>
        If a return or exchange is approved due to an error attributable to
        SOIS, such as an incorrect or damaged product being delivered, SOIS
        will provide further instructions regarding the return process.
      </p>
      <p>Customers should not ship products back without receiving confirmation or instructions from SOIS.</p>

      <h2>9. Important Note</h2>
      <p>SOIS reserves the right to review and verify every return, refund and exchange request before approving it.</p>
      <p>
        Providing an unboxing video does not automatically guarantee
        approval. Each request will be reviewed based on the condition of
        the product, packaging, evidence provided and the circumstances of
        the claim.
      </p>
      <p>
        For any questions regarding returns, refunds or exchanges, please
        contact our customer support team through the{" "}
        <a href="/contact">contact details</a> provided on the SOIS website.
      </p>
      <p>
        By placing an order with SOIS, you acknowledge and agree to the
        terms of this Returns, Refunds &amp; Exchange Policy.
      </p>
    </LegalPage>
  );
}
