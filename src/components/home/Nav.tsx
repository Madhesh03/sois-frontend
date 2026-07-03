"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { T } from "@/lib/tokens";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navLinks: { label: string; href: string }[] = [
  { label: "Collections", href: "/shop" },
  { label: "New Arrivals", href: "/shop" },
  { label: "Best Sellers", href: "/shop" },
  { label: "About", href: "/" },
];
const categories = ["All Categories", "Rings", "Earrings", "Necklaces", "Bracelets", "Anklets"];
const categorySlugs: Record<string, string> = {
  Rings: "rings",
  Earrings: "earrings",
  Necklaces: "necklaces",
  Bracelets: "bracelets",
  Anklets: "anklets",
};

export function Nav({ scrolled }: { scrolled: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCat, setSearchCat] = useState("All Categories");
  const closeMenu = () => {
    // Move focus out before the menu becomes aria-hidden, so a focused link
    // isn't left inside a hidden region (accessibility warning).
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement | null)?.blur();
    }
    setMenuOpen(false);
  };
  const router = useRouter();

  const { openModal, isAuthenticated, user } = useAuth();
  const { openCart, getItemCount } = useCart();
  const { openWishlist, getWishlistCount } = useWishlist();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    const slug = categorySlugs[searchCat];
    const base = slug ? `/category/${slug}` : "/shop";
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
    closeMenu();
  };

  const cartCount = getItemCount();
  const wishlistCount = getWishlistCount();

  return (
    <header>
      <nav
        className="sois-hdr"
        aria-label="Main navigation"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.98)" : T.white,
          backdropFilter: scrolled ? "blur(12px)" : "none",
          boxShadow: scrolled ? "0 2px 12px rgba(0,0,0,0.06)" : "0 1px 0 rgba(17,94,89,0.08)",
          transition: "box-shadow 0.35s ease, background 0.35s ease",
        }}
      >
        {/* ───── Row 1: hamburger · logo · account icons ───── */}
        <div className="sois-hdr-row1">
          {/* Left group: hamburger (mobile) + desktop links */}
          <div className="sois-hdr-left">
            <button
              type="button"
              className="sois-hdr-menu-btn sois-touch-target"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={22} color={T.forest} strokeWidth={2.4} /> : <Menu size={22} color={T.forest} strokeWidth={2} />}
            </button>

            <div className="sois-hdr-links">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="nav-link"
                  style={{
                    fontSize: "0.74rem",
                    letterSpacing: "0.08em",
                    fontWeight: 500,
                    color: T.muted,
                    textDecoration: "none",
                    transition: "color 0.2s",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = T.forest)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = T.muted)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Logo — centered */}
          <a href="/" aria-label="SOIS Home" className="sois-hdr-logo">
            <span className="sois-hdr-logo-name">SOIS</span>
            <span className="sois-hdr-logo-sub">
              <span className="sois-hdr-logo-rule" />
              STERLING SILVER
              <span className="sois-hdr-logo-rule" />
            </span>
          </a>

          {/* Right group: account icons */}
          <div className="sois-hdr-actions">
            <button
              type="button"
              aria-label={isAuthenticated ? `Account - ${user?.name}` : "Sign in"}
              className="sois-hdr-icon sois-touch-target"
              onClick={() =>
                isAuthenticated ? router.push("/account") : openModal("login")
              }
            >
              <User size={20} color={T.forest} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label={`Wishlist with ${wishlistCount} items`}
              className="sois-hdr-icon sois-touch-target"
              onClick={openWishlist}
            >
              <Heart size={20} color={T.forest} strokeWidth={1.8} />
              {wishlistCount > 0 && (
                <span className="sois-hdr-badge" aria-hidden="true">{wishlistCount}</span>
              )}
            </button>

            <button
              type="button"
              aria-label={`Shopping cart with ${cartCount} items`}
              className="sois-hdr-icon sois-touch-target"
              onClick={openCart}
            >
              <ShoppingBag size={20} color={T.forest} strokeWidth={1.8} />
              {cartCount > 0 && (
                <span className="sois-hdr-badge" aria-hidden="true">{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* ───── Row 2: full-width search bar ───── */}
        <div className="sois-hdr-row2">
          <form className="sois-search" role="search" onSubmit={handleSearch}>
            <div className="sois-search-cat">
              <select
                aria-label="Product category"
                value={searchCat}
                onChange={(e) => setSearchCat(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} color={T.muted} className="sois-search-cat-caret" />
            </div>

            <span className="sois-search-divider" aria-hidden="true" />

            <input
              type="search"
              className="sois-search-input"
              placeholder="Search for products"
              aria-label="Search for products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button type="submit" className="sois-search-btn" aria-label="Search">
              <Search size={18} color={T.white} strokeWidth={2.2} />
            </button>
          </form>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <div
        id="mobile-menu"
        className={`sois-mobile-menu${menuOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="sois-mobile-menu-inner">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={closeMenu}
              className="sois-mobile-nav-link"
            >
              {item.label}
            </Link>
          ))}
          <div className="sois-mobile-menu-divider" />
          {["Rings", "Earrings", "Necklaces", "Bracelets", "Anklets"].map((c) => (
            <Link
              key={c}
              href={`/category/${categorySlugs[c]}`}
              onClick={closeMenu}
              className="sois-mobile-nav-link"
            >
              {c}
            </Link>
          ))}
          <div className="sois-mobile-menu-divider" />
          <Link href="/account" onClick={closeMenu} className="sois-mobile-nav-link">
            My Account
          </Link>
          <Link href="/account/orders" onClick={closeMenu} className="sois-mobile-nav-link">
            My Orders
          </Link>
          <button
            type="button"
            onClick={() => {
              closeMenu();
              openWishlist();
            }}
            className="sois-mobile-nav-link"
            style={{ background: "none", border: "none", textAlign: "left", cursor: "pointer", width: "100%" }}
          >
            Wishlist
          </button>
        </div>
      </div>
      {menuOpen && <div className="sois-mobile-overlay" onClick={closeMenu} aria-hidden="true" />}
    </header>
  );
}
