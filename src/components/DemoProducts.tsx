"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import { T } from "@/lib/tokens";
import { Heart, ShoppingBag, LogIn } from "lucide-react";

const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Crescent Moon Pendant",
    price: 1299,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='35' fill='%23115E59' opacity='0.5'/%3E%3Cpath d='M 50 20 Q 70 35 70 50 Q 70 65 50 75 Q 40 70 40 50 Q 40 35 50 20' fill='%23115E59'/%3E%3C/svg%3E",
    category: "Necklaces",
    description: "Elegant crescent moon pendant in sterling silver",
  },
  {
    id: "2",
    name: "Minimalist Ring",
    price: 899,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='30' fill='none' stroke='%23115E59' stroke-width='8'/%3E%3C/svg%3E",
    category: "Rings",
    description: "Simple and elegant sterling silver ring",
  },
  {
    id: "3",
    name: "Pearl Earrings",
    price: 1499,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Ccircle cx='35' cy='40' r='15' fill='%23115E59'/%3E%3Ccircle cx='65' cy='40' r='15' fill='%23115E59'/%3E%3Cpath d='M 35 55 L 35 70' stroke='%23115E59' stroke-width='2'/%3E%3Cpath d='M 65 55 L 65 70' stroke='%23115E59' stroke-width='2'/%3E%3C/svg%3E",
    category: "Earrings",
    description: "Beautiful pearl drop earrings",
  },
  {
    id: "4",
    name: "Bangle Set",
    price: 1899,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Ccircle cx='50' cy='50' r='28' fill='none' stroke='%23115E59' stroke-width='6'/%3E%3Ccircle cx='50' cy='50' r='22' fill='none' stroke='%23115E59' stroke-width='6'/%3E%3C/svg%3E",
    category: "Bangles",
    description: "Set of two delicate sterling silver bangles",
  },
  {
    id: "5",
    name: "Ankle Bracelet",
    price: 699,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Cpath d='M 30 50 Q 50 30 70 50' fill='none' stroke='%23115E59' stroke-width='6'/%3E%3Ccircle cx='35' cy='55' r='4' fill='%23115E59'/%3E%3Ccircle cx='50' cy='35' r='4' fill='%23115E59'/%3E%3Ccircle cx='65' cy='55' r='4' fill='%23115E59'/%3E%3C/svg%3E",
    category: "Anklets",
    description: "Delicate ankle bracelet perfect for any occasion",
  },
  {
    id: "6",
    name: "Locket Pendant",
    price: 1099,
    image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23F3F4F6' width='100' height='100'/%3E%3Crect x='35' y='30' width='30' height='40' rx='2' fill='%23115E59'/%3E%3Cline x1='50' y1='30' x2='50' y2='70' stroke='%23F3F4F6' stroke-width='2'/%3E%3C/svg%3E",
    category: "Necklaces",
    description: "Beautiful locket pendant for memories",
  },
];

export function DemoProducts() {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { openModal, isAuthenticated } = useAuth();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleAddToCart = (product: (typeof DEMO_PRODUCTS)[0]) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleWishlist = (product: (typeof DEMO_PRODUCTS)[0]) => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }
    addToWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
        }}
      >
        {DEMO_PRODUCTS.map((product) => (
          <div
            key={product.id}
            onMouseEnter={() => setHoveredId(product.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              background: T.white,
              border: `1px solid ${T.border}`,
              transition: "all 0.3s ease",
              transform: hoveredId === product.id ? "translateY(-8px)" : "translateY(0)",
              boxShadow:
                hoveredId === product.id
                  ? "0 12px 24px rgba(0,0,0,0.1)"
                  : "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {/* Product Image */}
            <div
              style={{
                width: "100%",
                height: 180,
                background: T.surface,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  transform:
                    hoveredId === product.id ? "scale(1.05)" : "scale(1)",
                }}
              />

              {/* Wishlist Button */}
              <button
                onClick={() => handleWishlist(product)}
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: T.white,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  color={isInWishlist(product.id) ? "#d4183d" : T.muted}
                  fill={isInWishlist(product.id) ? "#d4183d" : "none"}
                />
              </button>
            </div>

            {/* Product Info */}
            <div style={{ padding: "16px" }}>
              <p
                style={{
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  color: T.forest,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  margin: "0 0 6px 0",
                }}
              >
                {product.category}
              </p>

              <h3
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: T.ink,
                  margin: "0 0 6px 0",
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: T.muted,
                  margin: "0 0 12px 0",
                }}
              >
                {product.description}
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <p
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: T.forest,
                    margin: 0,
                  }}
                >
                  ₹{product.price.toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "0.8rem",
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
                <ShoppingBag size={14} /> Add to Bag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
