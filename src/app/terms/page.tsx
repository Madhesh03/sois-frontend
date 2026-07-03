import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing your use of the SOIS website and purchases of our sterling silver jewellery.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="2 July 2026"
      intro="These Terms & Conditions govern your access to and use of the SOIS website and the purchase of products from us. By using our website or placing an order, you agree to these terms."
    >
      <h2>Use of the Website</h2>
      <p>
        You agree to use the website only for lawful purposes and in a way that
        does not infringe the rights of, or restrict the use of, this site by
        others. You are responsible for maintaining the confidentiality of your
        account credentials.
      </p>

      <h2>Products & Pricing</h2>
      <ul>
        <li>
          All products are handcrafted 925 sterling silver. Slight variations in
          finish are a natural characteristic of handmade jewellery.
        </li>
        <li>
          Prices are listed in Indian Rupees (₹) and are inclusive of applicable
          taxes unless stated otherwise.
        </li>
        <li>
          We reserve the right to correct pricing errors and update prices,
          descriptions, and availability at any time without notice.
        </li>
      </ul>

      <h2>Orders</h2>
      <p>
        Your order is an offer to purchase. We reserve the right to accept or
        decline any order. An order is confirmed once payment is successfully
        processed and you receive an order confirmation.
      </p>

      <h2>Payment</h2>
      <p>
        Payments are processed securely through our payment gateway. By placing
        an order you confirm that the payment details provided are valid and
        that you are authorised to use them.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website — including logos, product images, designs,
        and text — is the property of SOIS and may not be reproduced without our
        written permission.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, SOIS shall not be liable for any
        indirect or consequential loss arising from the use of our website or
        products. Nothing in these terms limits liability that cannot be limited
        under applicable law.
      </p>

      <h2>Governing Law</h2>
      <p>
        These terms are governed by the laws of India. Any disputes shall be
        subject to the exclusive jurisdiction of the courts of India.
      </p>

      <h2>Changes to These Terms</h2>
      <p>
        We may update these Terms & Conditions from time to time. Continued use
        of the website after changes constitutes acceptance of the revised
        terms.
      </p>
    </LegalPage>
  );
}
