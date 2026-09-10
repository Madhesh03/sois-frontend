"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";

const faqs = [
  {
    q: "How long will my order take to arrive?",
    a: "Orders are processed within 1–3 business days, and standard shipping usually takes 3–7 business days depending on your location. You'll receive a tracking link by email/SMS as soon as your order is dispatched.",
  },
  {
    q: "Can I cancel or change my order after it's placed?",
    a: "To keep dispatch times fast, orders are processed immediately and cannot be cancelled, modified, or changed once placed. Please double-check your shipping details and item choices before completing payment.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards, net banking, UPI, and popular digital wallets. Every transaction is completely secure and encrypted.",
  },
  {
    q: "What should I do if my jewellery arrives damaged or is the wrong item?",
    a: "Email our support team or message us on WhatsApp within 48 hours of delivery. You'll need to share a clear, unedited unboxing video to claim a replacement or refund.",
  },
  {
    q: "Why do I need to record an unboxing video?",
    a: "Because every piece is packed by hand, a continuous unboxing video helps us pinpoint exactly where a mistake or transit damage occurred. It acts as mandatory proof for our insurance and courier partners — without an unedited video starting from the sealed package, we're unable to process a return or replacement.",
  },
  {
    q: "Is SOIS jewellery made of real sterling silver?",
    a: "Yes — every piece is crafted from high-quality 925 sterling silver, perfect for daily wear and sensitive skin.",
  },
  {
    q: "How is my personal data protected?",
    a: "Your privacy is safe with us. Your name, mobile number, and email address are encrypted and used solely to fulfil your orders and send delivery updates. We never share your data.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="sois-section sois-hfaq" aria-labelledby="faq-heading">
      <div className="sois-hfaq-grid">
        <div className="sois-hfaq-intro">
          <Eyebrow>SUPPORT</Eyebrow>
          <h2 id="faq-heading" className="sois-hfaq-title">
            Frequently Asked Questions
          </h2>
          <p className="sois-hfaq-sub">
            Everything you need to know about orders, shipping, and caring for your sterling silver.
          </p>
          <a href="#" className="sois-hfaq-contact">
            Still have a question?<span> Contact us →</span>
          </a>
        </div>

        <div className="sois-hfaq-list">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`sois-hfaq-item${isOpen ? " is-open" : ""}`} key={item.q}>
                <button
                  type="button"
                  className="sois-hfaq-q sois-touch-target"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="sois-hfaq-q-text">{item.q}</span>
                  <span className="sois-hfaq-icon" aria-hidden="true">
                    {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                  </span>
                </button>
                <div className="sois-hfaq-a">
                  <div className="sois-hfaq-a-inner">
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
