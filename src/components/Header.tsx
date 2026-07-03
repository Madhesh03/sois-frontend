"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { T } from "@/lib/tokens";
import { Heart, ShoppingBag, LogOut } from "lucide-react";

export function Header() {
  const { openModal, isAuthenticated, user, logout } = useAuth();
  const { openCart, getItemCount } = useCart();
  const { openWishlist, getWishlistCount } = useWishlist();

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <header
      style={{
        background: T.white,
        borderBottom: `1px solid ${T.border}`,
        padding: "16px 20px",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: T.forest,
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          SOIS
        </a>

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Wishlist */}
          <button
            onClick={openWishlist}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: 8,
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "relative",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
            }}
            aria-label="Wishlist"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: "#d4183d",
                  color: T.white,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart */}
          <button
            onClick={openCart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: 8,
              display: "flex",
              alignItems: "center",
              gap: 4,
              position: "relative",
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = T.forest;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = T.muted;
            }}
            aria-label="Shopping cart"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  background: T.forest,
                  color: T.white,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth */}
          {isAuthenticated ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: T.muted,
                }}
              >
                {user?.name}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  padding: 8,
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#d4183d";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = T.muted;
                }}
                aria-label="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => openModal("login")}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: T.forest,
                  color: T.white,
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
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
                Sign In
              </button>
              <button
                onClick={() => openModal("register")}
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: T.forest,
                  border: `1px solid ${T.forest}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(17, 94, 89, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
