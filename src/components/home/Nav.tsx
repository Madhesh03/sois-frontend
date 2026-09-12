"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Search, Heart, User, Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import { T } from "@/lib/tokens";
import { searchProducts, formatPrice, type Product } from "@/lib/catalog";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const navLinks: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Collections", href: "/shop" },
  { label: "New Arrivals", href: "/shop?filter=new" },
  { label: "Best Sellers", href: "/shop?filter=best" },
  { label: "Gift Hampers", href: "/gift-hampers" },
  { label: "About", href: "/about" },
];
const categories = ["All Categories", "Rings", "Earrings", "Chain/Necklaces", "Bracelets", "Sets"];
const categorySlugs: Record<string, string> = {
  Rings: "rings",
  Earrings: "earrings",
  "Chain/Necklaces": "necklaces",
  Bracelets: "bracelets",
  Sets: "sets",
};
const QUICK_TERMS = ["Rings", "Necklaces", "Bracelets", "Earrings", "Gifts"];
const MAX_RESULTS = 6;

export function Nav({ scrolled }: { scrolled: boolean }) {
  const pathname = usePathname();
  // Reflect the active category route in the selector so it survives a search
  // navigation (the Nav remounts on route change, which otherwise resets it).
  const categoryFromPath = useMemo(() => {
    const match = pathname?.match(/^\/category\/([^/?#]+)/);
    if (!match) return "All Categories";
    const found = Object.entries(categorySlugs).find(([, slug]) => slug === match[1]);
    return found ? found[0] : "All Categories";
  }, [pathname]);

  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchCat, setSearchCat] = useState(categoryFromPath);

  // Keep the selector in sync when the route's category changes (e.g. when the
  // Nav instance is preserved across category→category navigations).
  useEffect(() => {
    setSearchCat(categoryFromPath);
  }, [categoryFromPath]);
  const closeMenu = () => {
    // Move focus out before the menu becomes aria-hidden, so a focused link
    // isn't left inside a hidden region (accessibility warning).
    if (typeof document !== "undefined") {
      (document.activeElement as HTMLElement | null)?.blur();
    }
    setMenuOpen(false);
  };
  const router = useRouter();

  const [searchFocused, setSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchWrapRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { openModal, isAuthenticated, user } = useAuth();
  const { openCart, getItemCount } = useCart();
  const { openWishlist, getWishlistCount } = useWishlist();

  // Live results as the user types — scoped to the selected category, capped
  // for the dropdown. Fetched from the catalogue API with a short debounce.
  const [results, setResults] = useState<Product[]>([]);
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    let cancelled = false;
    const handle = setTimeout(async () => {
      const list = await searchProducts(q);
      if (cancelled) return;
      const slug = categorySlugs[searchCat];
      const scoped = slug ? list.filter((p) => p.category === slug) : list;
      setResults(scoped.slice(0, MAX_RESULTS));
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [query, searchCat]);

  // Reset the keyboard highlight whenever the result set changes.
  useEffect(() => setActiveIndex(-1), [query, searchCat]);

  // Close the dropdown on an outside click.
  useEffect(() => {
    if (!searchFocused) return;
    const onDown = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchFocused]);

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    const slug = categorySlugs[searchCat];
    const base = slug ? `/category/${slug}` : "/shop";
    const qs = params.toString();
    router.push(qs ? `${base}?${qs}` : base);
    setSearchFocused(false);
    closeMenu();
  };

  const goToProduct = (p: Product) => {
    router.push(`/product/${p.slug}`);
    setSearchFocused(false);
    setQuery("");
  };

  const applyQuickTerm = (term: string) => {
    setQuery(term.toLowerCase());
    setSearchFocused(true);
    searchInputRef.current?.focus();
  };

  const onSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setSearchFocused(false);
      searchInputRef.current?.blur();
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      goToProduct(results[activeIndex]);
    }
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
        {/* ───── Row 1: logo (far left) · nav links · account icons ───── */}
        <div className="sois-hdr-row1">
          {/* Hamburger — mobile only, far left */}
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

          {/* Logo — far left (transparent wordmark, background stripped) */}
          <a href="/" aria-label="SOIS Home" className="sois-hdr-logo">
            <Image
              className="sois-hdr-logo-img"
              src="/sois-logo.png"
              alt="SOIS"
              width={1106}
              height={402}
              priority
            />
          </a>

          {/* Desktop nav links — left-aligned beside the logo */}
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
              aria-label={`Shopping bag with ${cartCount} items`}
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

        {/* ───── Row 2: full-width search bar with live results ───── */}
        {/* Collapses out of view once the page is scrolled; visible only at the top. */}
        <div className={`sois-hdr-row2${scrolled ? " collapsed" : ""}`}>
          <div className="sois-search-wrap" ref={searchWrapRef}>
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
                ref={searchInputRef}
                type="search"
                className="sois-search-input"
                placeholder="Search for products"
                aria-label="Search for products"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onKeyDown={onSearchKeyDown}
                autoComplete="off"
                role="combobox"
                aria-expanded={searchFocused}
                aria-controls="sois-search-dropdown"
              />

              <button type="submit" className="sois-search-btn" aria-label="Search">
                <Search size={18} color={T.white} strokeWidth={2.2} />
              </button>
            </form>

            {searchFocused && (
              <div className="sois-search-dropdown" id="sois-search-dropdown">
                <div className="sois-search-quick">
                  <span className="sois-search-quick-label">Quick search:</span>
                  {QUICK_TERMS.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="sois-search-quick-term"
                      onClick={() => applyQuickTerm(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>

                {query.trim() &&
                  (results.length > 0 ? (
                    <ul className="sois-search-results">
                      {results.map((p, i) => (
                        <li key={p.id}>
                          <button
                            type="button"
                            className={`sois-search-result${i === activeIndex ? " active" : ""}`}
                            onClick={() => goToProduct(p)}
                            onMouseEnter={() => setActiveIndex(i)}
                          >
                            <span className="sois-search-result-img">
                              <Image
                                src={p.images[0]}
                                alt={p.name}
                                fill
                                sizes="54px"
                                style={{ objectFit: "cover" }}
                              />
                            </span>
                            <span className="sois-search-result-info">
                              <span className="sois-search-result-name">{p.name}</span>
                              <span className="sois-search-result-price">
                                {p.originalPrice && (
                                  <span className="sois-search-result-orig">
                                    {formatPrice(p.originalPrice)}
                                  </span>
                                )}
                                <span className="sois-search-result-now">{formatPrice(p.price)}</span>
                              </span>
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="sois-search-empty">
                      No products found for &ldquo;{query.trim()}&rdquo;.
                    </div>
                  ))}

                {query.trim() && results.length > 0 && (
                  <button
                    type="button"
                    className="sois-search-viewall"
                    onClick={() => handleSearch()}
                  >
                    View All <ArrowRight size={15} />
                  </button>
                )}
              </div>
            )}
          </div>
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
          {["Rings", "Earrings", "Chain/Necklaces", "Bracelets", "Sets"].map((c) => (
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
