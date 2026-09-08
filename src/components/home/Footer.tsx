"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Heart, MessageCircle, ChevronDown } from "lucide-react";
import { T } from "@/lib/tokens";

// Same deep forest as the Quality You Can Feel panel, with a much lighter glow
// so the larger footer surface doesn't read as saturated.
const footerBg = "#1d3638";
const footerBgImage = "radial-gradient(circle at 50% 0%, rgba(17, 94, 89, 0.12) 0%, transparent 48%)";
const textFaint = "rgba(224,234,231,0.45)";
const textMid = "rgba(224,234,231,0.66)";

export function Footer() {
  const [openCol, setOpenCol] = useState<string | null>(null);

  const toggleCol = (heading: string) => {
    setOpenCol((prev) => (prev === heading ? null : heading));
  };

  const cols: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Shop",
      links: [
        { label: "Rings", href: "/category/rings" },
        { label: "Earrings", href: "/category/earrings" },
        { label: "Necklaces", href: "/category/necklaces" },
        { label: "Bracelets", href: "/category/bracelets" },
        { label: "Anklets", href: "/category/anklets" },
        { label: "Gift Sets", href: "/category/gifts" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track Order", href: "/account/orders" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Return Policy", href: "/return-policy" },
        { label: "FAQs", href: "/faq" },
        { label: "Contact Us", href: "/contact" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About SOIS", href: "/about" },
        { label: "Our Story", href: "/about" },
        { label: "Sustainability", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Privacy Policy", href: "/privacy-policy" },
        { label: "Terms & Conditions", href: "/terms" },
        { label: "Refund Policy", href: "/refund-policy" },
        { label: "Cookie Policy", href: "/privacy-policy" },
      ],
    },
  ];

  const socials = [
    { Icon: Instagram, label: "Instagram" },
    { Icon: Heart, label: "Pinterest" },
    { Icon: MessageCircle, label: "WhatsApp" },
  ];

  return (
    <footer className="sois-footer" style={{ background: footerBg, backgroundImage: footerBgImage }}>
      <div className="sois-footer-accent" style={{ background: `linear-gradient(90deg, rgba(17,94,89,0.38) 0%, rgba(153,246,228,0.16) 45%, rgba(206,232,210,0.03) 100%)` }} />

      <div className="sois-footer-main">
        <div className="sois-footer-brand">
          <div>
            <div className="sois-footer-logo">SOIS</div>
            <div className="sois-footer-logo-sub">STERLING SILVER JEWELLERY</div>
          </div>

          <div className="sois-footer-social">
            {socials.map(({ Icon, label }) => (
              <a key={label} href="#" title={label} aria-label={label} className="sois-touch-target sois-footer-social-btn">
                <Icon size={15} color={T.sage} />
              </a>
            ))}
          </div>

          <div className="sois-footer-hallmark">
            <div className="sois-footer-hallmark-badge">925</div>
            <div>
              <div className="sois-footer-hallmark-title">Hallmarked Silver</div>
              <div className="sois-footer-hallmark-sub">Certified purity guaranteed</div>
            </div>
          </div>
        </div>

        <div className="sois-footer-nav-grid">
          {cols.map((col) => {
            const isOpen = openCol === col.heading;
            return (
              <nav key={col.heading} aria-label={col.heading} className="sois-footer-col">
                <button className="sois-footer-col-toggle" onClick={() => toggleCol(col.heading)} aria-expanded={isOpen}>
                  <span className="sois-footer-col-heading">{col.heading.toUpperCase()}</span>
                  <ChevronDown size={15} color={T.sage} className={`sois-footer-col-icon${isOpen ? " open" : ""}`} />
                </button>
                <div className={`sois-footer-links-list${isOpen ? " open" : ""}`}>
                  {col.links.map((link) =>
                    link.href === "#" ? (
                      <a key={link.label} href="#" className="sois-footer-link">
                        {link.label}
                      </a>
                    ) : (
                      <Link key={link.label} href={link.href} className="sois-footer-link">
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </nav>
            );
          })}
        </div>
      </div>

      <div className="sois-footer-contact">
        <a href="mailto:support@soisstore.com" className="sois-footer-contact-item">support@soisstore.com</a>
        <span className="sois-footer-contact-sep">·</span>
        <a href="tel:+917540008075" className="sois-footer-contact-item">+91 75400 08075</a>
      </div>

      <div className="sois-footer-bottom">
        <span className="sois-footer-copy">© 2025 SOIS. All rights reserved.</span>
        <div className="sois-footer-pay">
          {["Visa", "Mastercard", "UPI", "Razorpay"].map((m) => (
            <span key={m} className="sois-footer-pay-badge">
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
