import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SOIS collects, uses, and protects your personal information when you shop our 925 sterling silver jewellery.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="2 July 2026"
      intro="SOIS (“we”, “us”, “our”) is committed to protecting your privacy. This policy explains what information we collect, how we use it, and the choices you have when you use our website."
    >
      <h2>Information We Collect</h2>
      <p>
        When you shop with us or create an account, we may collect information
        you provide directly, including:
      </p>
      <ul>
        <li>Name, email address, and phone number</li>
        <li>Billing and delivery addresses</li>
        <li>Order history and preferences</li>
        <li>
          Payment details, which are processed securely by our payment gateway
          and are not stored on our servers
        </li>
      </ul>
      <p>
        We also collect certain information automatically, such as your device
        type, browser, and how you interact with our site, through cookies and
        similar technologies.
      </p>

      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process and deliver your orders</li>
        <li>To manage your account and provide customer support</li>
        <li>To send order updates and, with consent, marketing communications</li>
        <li>To improve our website, products, and services</li>
        <li>To detect and prevent fraud and comply with legal obligations</li>
      </ul>

      <h2>Sharing Your Information</h2>
      <p>
        We do not sell your personal information. We share it only with trusted
        service providers who help us operate our business — such as payment
        gateways, shipping partners, and analytics providers — and only to the
        extent necessary to perform their services.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies to keep your bag and session working, remember your
        preferences, and understand site usage. You can control cookies through
        your browser settings, though some features may not function without
        them.
      </p>

      <h2>Data Security</h2>
      <p>
        We implement industry-standard measures — including SSL encryption and
        secure authentication — to protect your information. No method of
        transmission over the internet is completely secure, but we work to keep
        your data safe.
      </p>

      <h2>Your Rights</h2>
      <p>
        You may access, update, or request deletion of your personal information
        at any time by managing your account or contacting us. You may also opt
        out of marketing communications using the unsubscribe link in our
        emails.
      </p>

      <h2>Contact</h2>
      <p>
        For any privacy questions or requests, email us at{" "}
        <a href="mailto:support@soisstore.com">support@soisstore.com</a>.
      </p>
    </LegalPage>
  );
}
