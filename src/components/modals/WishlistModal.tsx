"use client";

import React from "react";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { Modal } from "./Modal";
import { T } from "@/lib/tokens";
import { Heart, ShoppingBag } from "lucide-react";

export function WishlistModal() {
  const { items, wishlistOpen, closeWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  return (
    <Modal
      isOpen={wishlistOpen}
      onClose={closeWishlist}
      title="Wishlist"
      size="md"
    >
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px" }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: "rgba(17, 94, 89, 0.1)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Heart size={28} color={T.forest} />
          </div>
          <p
            style={{
              fontSize: "0.95rem",
              color: T.muted,
              marginBottom: 8,
            }}
          >
            Your wishlist is empty
          </p>
          <p style={{ fontSize: "0.85rem", color: T.faint, margin: 0 }}>
            Add items you love and come back to shop them later
          </p>
        </div>
      ) : (
        <div>
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                gap: 12,
                paddingBottom: 16,
                marginBottom: 16,
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  width: 80,
                  height: 80,
                  background: T.surface,
                  borderRadius: 8,
                  overflow: "hidden",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: T.ink,
                    margin: 0,
                    marginBottom: 4,
                  }}
                >
                  {item.name}
                </h4>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: T.muted,
                    margin: 0,
                    marginBottom: 12,
                  }}
                >
                  ₹{item.price.toLocaleString()}
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <button
                    onClick={() =>
                      addToCart({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                      })
                    }
                    style={{
                      flex: 1,
                      padding: "8px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      background: T.forest,
                      color: T.white,
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0D4A46";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = T.forest;
                    }}
                  >
                    <ShoppingBag size={12} /> Add
                  </button>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    style={{
                      padding: "8px 12px",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      background: "transparent",
                      color: "#d4183d",
                      border: `1px solid #d4183d`,
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(212, 24, 61, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}
