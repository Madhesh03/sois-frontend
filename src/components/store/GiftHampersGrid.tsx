"use client";

import Image from "next/image";
import { Gift, Check } from "lucide-react";
import { Product, formatPrice } from "@/lib/catalog";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";

/** Fixed capacity of one hamper box (mirrors backend GIFT_HAMPER_CAPACITY). */
const HAMPER_CAPACITY = 4;

export function GiftHampersGrid({ hampers }: { hampers: Product[] }) {
  const { items, giftHamper, setGiftHamper, openCart, getItemCount } = useCart();
  const hasJewellery = items.length > 0;
  const pieces = getItemCount();
  const selectedId = giftHamper?.product_id ?? null;

  if (hampers.length === 0) {
    return (
      <div className="sois-empty">
        <p className="sois-empty-title">No gift hampers available yet</p>
        <p className="sois-empty-sub">Please check back soon.</p>
      </div>
    );
  }

  return (
    <>
      {!hasJewellery && (
        <p
          style={{
            textAlign: "center",
            color: T.muted,
            fontSize: "0.9rem",
            margin: "0 0 24px",
          }}
        >
          Add a jewellery item to your bag first — a gift hamper is added on top
          of your order (it holds up to {HAMPER_CAPACITY} pieces per box).
        </p>
      )}

      <div className="sois-grid">
        {hampers.map((h) => {
          const selected = selectedId === h.id;
          return (
            <article className="sois-scard" key={h.id}>
              <div className="sois-pcard-img">
                <Image
                  className="pc-img"
                  src={h.images[0]}
                  alt={h.name}
                  fill
                  sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  // Hamper photos are full-bleed lifestyle shots — fill the card
                  // frame (cover) rather than letterboxing them (contain).
                  style={{ objectFit: "cover" }}
                />
                {selected && (
                  <span
                    className="sois-pcard-tag"
                    style={{ background: T.forest, color: T.white }}
                  >
                    SELECTED
                  </span>
                )}
              </div>

              <div className="sois-pcard-body">
                <div className="sois-pcard-sub">
                  Holds up to {HAMPER_CAPACITY} pieces
                </div>
                <div className="sois-pcard-name">{h.name}</div>
                <div className="sois-pcard-price-row">
                  <span className="sois-pcard-price">{formatPrice(h.price)}</span>
                  <span
                    style={{ fontSize: "0.72rem", color: T.faint }}
                  >
                    per box
                  </span>
                </div>

                {selected ? (
                  <button
                    type="button"
                    className="sois-pcard-add sois-touch-target"
                    style={{ background: T.forest, color: T.white }}
                    onClick={() => setGiftHamper(null)}
                  >
                    <Check size={14} /> ADDED · REMOVE
                  </button>
                ) : (
                  <button
                    type="button"
                    className="sois-pcard-add sois-touch-target"
                    disabled={!hasJewellery}
                    style={
                      !hasJewellery
                        ? { opacity: 0.5, cursor: "not-allowed" }
                        : undefined
                    }
                    onClick={() => {
                      if (!hasJewellery) return;
                      setGiftHamper(h.id);
                      openCart();
                    }}
                  >
                    <Gift size={14} />{" "}
                    {hasJewellery ? "ADD GIFT PACKAGING" : "ADD ITEMS FIRST"}
                  </button>
                )}

                {selected && giftHamper && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      fontSize: "0.78rem",
                      color: T.muted,
                    }}
                  >
                    {giftHamper.boxes} box{giftHamper.boxes > 1 ? "es" : ""} for{" "}
                    {pieces} piece{pieces > 1 ? "s" : ""} ·{" "}
                    {formatPrice(Number(giftHamper.line_total))}
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
