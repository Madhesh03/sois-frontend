"use client";

import React from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { T } from "@/lib/tokens";
import { formatPrice } from "@/lib/catalog";
import { X, Heart, ShoppingBag } from "lucide-react";

// Resolve a product's detail-page path from its name (slugified — the product
// page resolves the live product by slug).
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function productHref(name: string): string {
  return `/product/${slugify(name)}`;
}

export function WishlistDrawer() {
  const { items, wishlistOpen, closeWishlist, removeFromWishlist } =
    useWishlist();
  const { addToCart } = useCart();

  if (!wishlistOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={closeWishlist}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 450,
          background: T.white,
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Heart size={20} color={T.forest} fill={T.forest} />
            <h2
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: T.ink,
              }}
            >
              Wishlist
            </h2>
          </div>
          <button
            onClick={closeWishlist}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: "4px",
              display: "flex",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
          }}
        >
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
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
                Add items you love from the collection
              </p>
            </div>
          ) : (
            <>
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
                  <Link
                    href={productHref(item.name)}
                    onClick={closeWishlist}
                    aria-label={`View ${item.name}`}
                    style={{
                      width: 80,
                      height: 80,
                      background: T.surface,
                      borderRadius: 8,
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "block",
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </Link>

                  <div style={{ flex: 1 }}>
                    <Link
                      href={productHref(item.name)}
                      onClick={closeWishlist}
                      style={{ textDecoration: "none" }}
                    >
                      <h4
                        onMouseEnter={(e) => (e.currentTarget.style.color = T.forest)}
                        onMouseLeave={(e) => (e.currentTarget.style.color = T.ink)}
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: T.ink,
                          margin: "0 0 4px 0",
                          cursor: "pointer",
                          transition: "color 0.2s ease",
                        }}
                      >
                        {item.name}
                      </h4>
                    </Link>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: T.muted,
                        margin: "0 0 12px 0",
                      }}
                    >
                      {formatPrice(item.price)}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                      }}
                    >
                      <button
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                          });
                          closeWishlist();
                        }}
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
                          e.currentTarget.style.background =
                            "rgba(212, 24, 61, 0.1)";
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
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(450px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </>
  );
}
