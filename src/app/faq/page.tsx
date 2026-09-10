"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";

const FAQS: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is your jewellery made of?",
    a: "Every SOIS piece is crafted from hallmarked 925 sterling silver — 92.5% pure silver with a durable rhodium finish. It’s nickel-free and hypoallergenic, so it’s gentle on sensitive skin.",
  },
  {
    q: "How do I care for my sterling silver?",
    a: "Store pieces in the anti-tarnish pouch provided, keep them away from perfume, lotion, and water, and polish gently with a soft silver cloth. Remove jewellery before swimming, bathing, or exercising.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit and debit cards, net banking, and popular wallets through our secure payment gateway.",
  },
  {
    q: "How long will delivery take?",
    a: (
      <>
        Orders are dispatched within 24–48 hours and typically arrive in 2–7
        business days depending on your location. See our{" "}
        <Link href="/shipping-policy">Shipping Policy</Link> for details.
      </>
    ),
  },
  {
    q: "Can I track my order?",
    a: (
      <>
        Yes. Once your order ships you’ll receive a tracking link, and you can
        follow its progress anytime under{" "}
        <Link href="/account/orders">My Orders</Link>.
      </>
    ),
  },
  {
    q: "What is your return and refund policy?",
    a: (
      <>
        Eligible items can be returned once the conditions in our policy are
        met. See our <Link href="/return-policy">Return Policy</Link> and{" "}
        <Link href="/refund-policy">Refund Policy</Link> for full details.
      </>
    ),
  },
  {
    q: "Do you offer gift packaging?",
    a: "Yes — our gift sets come in premium packaging with a card, and you can request gift packaging on other items at checkout.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">FAQs</span>
        </nav>
        <div className="sois-page-hero-eyebrow">HELP CENTRE</div>
        <h1 className="sois-page-hero-title">Frequently Asked Questions</h1>
        <p className="sois-page-hero-sub">
          Everything you need to know about SOIS jewellery, orders, and
          delivery.
        </p>
      </section>

      <section className="sois-faq">
        <div className="sois-faq-list">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className={`sois-faq-item${isOpen ? " open" : ""}`}>
                <button
                  type="button"
                  className="sois-faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  {item.q}
                  <Plus
                    size={18}
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>
                {isOpen && <div className="sois-faq-a">{item.a}</div>}
              </div>
            );
          })}
        </div>

        <div className="sois-faq-cta">
          <p>Still have a question?</p>
          <Link href="/contact" className="sois-account-cta">
            Contact Us
          </Link>
        </div>
      </section>
    </StoreShell>
  );
}
