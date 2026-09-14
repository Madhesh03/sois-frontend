"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Gift,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronRight as Crumb,
  Plus,
  Truck,
  PackageCheck,
} from "lucide-react";
import { Product, formatPrice } from "@/lib/catalog";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";

/** Fixed capacity of one hamper box (mirrors backend GIFT_HAMPER_CAPACITY). */
const HAMPER_CAPACITY = 4;

/**
 * Detail page for a gift-hamper packaging product. Shares the product-detail
 * layout (`sois-pdp` gallery + info panel) but a hamper is never a normal cart
 * line — it is chosen as an add-on for the whole order via `setGiftHamper`, so
 * the primary action selects/deselects it rather than "Add to Bag", and is
 * gated on there being jewellery in the bag (the backend sizes the box count
 * off the number of pieces).
 */
export function GiftHamperDetail({ hamper }: { hamper: Product }) {
  const { items, giftHamper, setGiftHamper, openCart, getItemCount } = useCart();
  const [activeImage, setActiveImage] = useState(0);
  const [openSection, setOpenSection] = useState<string | null>("about");

  const hasJewellery = items.length > 0;
  const pieces = getItemCount();
  const selected = giftHamper?.product_id === hamper.id;

  const media = hamper.images.map((src) => ({ src }));
  const activeSrc = media[activeImage]?.src ?? media[0]?.src;
  const goPrev = () => setActiveImage((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setActiveImage((i) => (i + 1) % media.length);

  const sections = [
    hamper.description && { key: "about", title: "About this hamper", body: <p>{hamper.description}</p> },
    hamper.care?.length && {
      key: "care",
      title: "Care",
      body: (
        <ul className="sois-care-list">
          {hamper.care.map((c) => <li key={c}>{c}</li>)}
        </ul>
      ),
    },
  ].filter(Boolean) as { key: string; title: string; body: React.ReactNode }[];

  return (
    <div className="sois-pdp">
      {/* Breadcrumb */}
      <nav className="sois-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <Crumb size={13} />
        <Link href="/gift-hampers">Gift Hampers</Link>
        <Crumb size={13} />
        <span aria-current="page">{hamper.name}</span>
      </nav>

      <div className="sois-pdp-grid">
        {/* Gallery */}
        <div className="sois-pdp-gallery">
          <div
            className="sois-pdp-main-img"
            tabIndex={0}
            onKeyDown={(e) => {
              if (media.length < 2) return;
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
              } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
              }
            }}
          >
            <Image
              src={activeSrc}
              alt={hamper.name}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
              priority
            />
            {selected && (
              <span className="sois-pcard-tag" style={{ background: T.forest, color: T.white }}>
                SELECTED
              </span>
            )}
            {media.length > 1 && (
              <>
                <button
                  type="button"
                  className="sois-pdp-nav sois-pdp-nav-prev"
                  aria-label="Previous image"
                  onClick={goPrev}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="sois-pdp-nav sois-pdp-nav-next"
                  aria-label="Next image"
                  onClick={goNext}
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}
          </div>
          <div className="sois-pdp-thumbs">
            {media.map((m, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View image ${i + 1}`}
                className={`sois-pdp-thumb${i === activeImage ? " active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <Image src={m.src} alt="" fill sizes="80px" style={{ objectFit: "cover" }} />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="sois-pdp-info">
          <div className="sois-pdp-sub">Ready-to-gift packaging</div>
          <h1 className="sois-pdp-name">{hamper.name}</h1>

          <div className="sois-pdp-price-row">
            <span className="sois-pdp-price">{formatPrice(hamper.price)}</span>
            <span style={{ fontSize: "0.8rem", color: T.faint }}>per box</span>
          </div>

          <div className="sois-pdp-stock" style={{ color: T.forest }}>
            <PackageCheck size={16} /> Holds up to {HAMPER_CAPACITY} pieces per box
          </div>

          {/* Primary action — select this hamper for the order */}
          <div className="sois-pdp-actions">
            {selected ? (
              <button
                type="button"
                className="sois-pdp-add"
                style={{ background: T.forest, color: T.white }}
                onClick={() => setGiftHamper(null)}
              >
                <Check size={16} /> Added · Remove
              </button>
            ) : (
              <button
                type="button"
                className="sois-pdp-add"
                disabled={!hasJewellery}
                onClick={() => {
                  if (!hasJewellery) return;
                  setGiftHamper(hamper.id);
                  openCart();
                }}
              >
                <Gift size={16} /> {hasJewellery ? "Add gift packaging" : "Add items first"}
              </button>
            )}
          </div>

          {selected && giftHamper ? (
            <p style={{ margin: "12px 0 0", fontSize: "0.82rem", color: T.muted }}>
              {giftHamper.boxes} box{giftHamper.boxes > 1 ? "es" : ""} for {pieces}{" "}
              piece{pieces > 1 ? "s" : ""} · {formatPrice(Number(giftHamper.line_total))}
            </p>
          ) : (
            !hasJewellery && (
              <p style={{ margin: "12px 0 0", fontSize: "0.82rem", color: T.muted }}>
                Add a jewellery item to your bag first — a gift hamper is added on top
                of your order, and we add the right number of boxes for you.
              </p>
            )
          )}

          {/* Trust row */}
          <div className="sois-pdp-trust">
            <span>
              <Gift size={16} /> Gift-ready
            </span>
            <span>
              <Truck size={16} /> Free Shipping
            </span>
          </div>

          {/* Accordion */}
          {sections.length > 0 && (
            <div className="sois-pdp-accordion">
              {sections.map((s) => {
                const open = openSection === s.key;
                return (
                  <div key={s.key} className="sois-acc-item">
                    <button
                      type="button"
                      className="sois-acc-head"
                      aria-expanded={open}
                      onClick={() => setOpenSection(open ? null : s.key)}
                    >
                      {s.title}
                      <Plus
                        size={16}
                        style={{
                          transform: open ? "rotate(45deg)" : "none",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>
                    {open && <div className="sois-acc-body">{s.body}</div>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
