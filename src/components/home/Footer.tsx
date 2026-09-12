"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { Instagram, Heart, ChevronDown, Truck } from "lucide-react";
import { T } from "@/lib/tokens";
import { useWishlist } from "@/context/WishlistContext";

const WHATSAPP_NUMBER = "917305272195";
const INSTAGRAM_HANDLE = "soisstore.co";

function WhatsAppIcon({ size = 15, color = T.sage }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.031 2C6.505 2 2.02 6.485 2.02 12.011c0 1.916.532 3.786 1.541 5.409L2 22l4.703-1.53a9.96 9.96 0 004.323.997h.005c5.526 0 10.011-4.485 10.011-10.011C21.042 6.93 16.557 2 12.031 2zm0 18.184h-.004a8.16 8.16 0 01-4.161-1.14l-.298-.177-3.096 1.008 1.024-3.017-.194-.309a8.146 8.146 0 01-1.253-4.346c0-4.51 3.671-8.181 8.186-8.181 2.187 0 4.243.852 5.789 2.399a8.126 8.126 0 012.396 5.792c0 4.51-3.671 8.181-8.19 8.181z" />
    </svg>
  );
}

// Same deep forest as the Quality You Can Feel panel, with a much lighter glow
// so the larger footer surface doesn't read as saturated.
const footerBg = "#1d3638";
const footerBgImage = "radial-gradient(circle at 50% 0%, rgba(17, 94, 89, 0.12) 0%, transparent 48%)";
const textFaint = "rgba(224,234,231,0.45)";
const textMid = "rgba(224,234,231,0.66)";

export function Footer() {
  const [openCol, setOpenCol] = useState<string | null>(null);
  const { openWishlist } = useWishlist();

  const toggleCol = (heading: string) => {
    setOpenCol((prev) => (prev === heading ? null : heading));
  };

  const cols: { heading: string; links: { label: string; href: string }[] }[] = [
    {
      heading: "Shop",
      links: [
        { label: "Rings", href: "/category/rings" },
        { label: "Earrings", href: "/category/earrings" },
        { label: "Chain/Necklaces", href: "/category/necklaces" },
        { label: "Bracelets", href: "/category/bracelets" },
        { label: "Gift Sets", href: "/category/gifts" },
      ],
    },
    {
      heading: "Help",
      links: [
        { label: "Track Order", href: "/account/orders" },
        { label: "Shipping Policy", href: "/shipping-policy" },
        { label: "Returns, Refunds & Exchange", href: "/return-policy" },
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

  const socials: {
    Icon: ComponentType<{ size?: number; color?: string }>;
    label: string;
    href?: string;
    onClick?: () => void;
  }[] = [
    { Icon: Instagram, label: "Instagram", href: `https://instagram.com/${INSTAGRAM_HANDLE}` },
    { Icon: Heart, label: "Wishlist", onClick: openWishlist },
    { Icon: WhatsAppIcon, label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}` },
  ];

  return (
    <footer className="sois-footer" style={{ background: footerBg, backgroundImage: footerBgImage }}>
      <div className="sois-footer-accent" style={{ background: `linear-gradient(90deg, rgba(17,94,89,0.38) 0%, rgba(153,246,228,0.16) 45%, rgba(206,232,210,0.03) 100%)` }} />

      <div className="sois-footer-main">
        <div className="sois-footer-brand">
          <div>
            <div className="sois-footer-logo">SOIS</div>
          </div>

          <div className="sois-footer-social">
            {socials.map(({ Icon, label, href, onClick }) =>
              onClick ? (
                <button
                  key={label}
                  type="button"
                  onClick={onClick}
                  title={label}
                  aria-label={label}
                  className="sois-touch-target sois-footer-social-btn"
                >
                  <Icon size={15} color={T.sage} />
                </button>
              ) : (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  aria-label={label}
                  className="sois-touch-target sois-footer-social-btn"
                >
                  <Icon size={15} color={T.sage} />
                </a>
              )
            )}
          </div>

          <div className="sois-footer-hallmark">
            <div className="sois-footer-hallmark-badge">925</div>
            <div>
              <div className="sois-footer-hallmark-title">Hallmarked Silver</div>
              <div className="sois-footer-hallmark-sub">Certified purity guaranteed</div>
            </div>
          </div>

          <div className="sois-footer-hallmark">
            <div className="sois-footer-hallmark-badge">
              <Truck size={18} color={T.sage} />
            </div>
            <div>
              <div className="sois-footer-hallmark-title">Free Shipping</div>
              <div className="sois-footer-hallmark-sub">On all orders across India</div>
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
        <a href="tel:+917305272195" className="sois-footer-contact-item">+91 73052 72195</a>
      </div>

      <div className="sois-footer-bottom">
        <span className="sois-footer-copy">© 2026 SOIS. All rights reserved.</span>
        <div className="sois-footer-pay">
          {["UPI", "Razorpay"].map((m) => (
            <span key={m} className="sois-footer-pay-badge">
              {m}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
