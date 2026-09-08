"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import {
  Product,
  formatPrice,
  getTopProducts,
  getAllProducts,
  badgeColors,
} from "@/lib/catalog";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const FILTERS = ["All", "New Arrivals", "Best Sellers", "On Sale"] as const;
type Filter = (typeof FILTERS)[number];

const MAX_CARDS = 8;

export function Products() {
  const [heartAnim, setHeartAnim] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const [switching, setSwitching] = useState(false);
  const [top, setTop] = useState<Product[]>([]);
  const [all, setAll] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const filtersRef = useRef<HTMLDivElement>(null);

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  // Live data: server-ranked bestsellers for the default view, plus the full
  // catalogue so the New/Best/Sale tabs filter against real products.
  useEffect(() => {
    let active = true;
    Promise.all([getTopProducts(MAX_CARDS), getAllProducts()])
      .then(([topItems, allItems]) => {
        if (!active) return;
        setTop(topItems);
        setAll(allItems);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const payload = (p: Product) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    image: p.images[0],
  });

  const handleAddToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (p.inStock) addToCart(payload(p));
  };

  const toggleWishlist = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    addToWishlist(payload(p));
    setHeartAnim(p.id);
    setTimeout(() => setHeartAnim(null), 420);
  };

  const scrollFilters = (dir: number) => {
    const el = filtersRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

  const visible = useMemo(() => {
    switch (activeFilter) {
      case "New Arrivals":
        return all.filter((p) => p.isNew).slice(0, MAX_CARDS);
      case "Best Sellers":
        return all.filter((p) => p.isBestSeller).slice(0, MAX_CARDS);
      case "On Sale":
        return all.filter((p) => p.originalPrice != null).slice(0, MAX_CARDS);
      case "All":
      default:
        return (top.length ? top : all).slice(0, MAX_CARDS);
    }
  }, [activeFilter, top, all]);

  // Replay a brief staggered fade-in on the cards each time the filter changes.
  useEffect(() => {
    setSwitching(true);
    const t = setTimeout(() => setSwitching(false), 800);
    return () => clearTimeout(t);
  }, [activeFilter]);

  return (
    <section className="sois-section sois-products" aria-labelledby="products-heading">
      <div className="sois-section-header sois-products-header">
        <div>
          <Eyebrow>HANDPICKED FOR YOU</Eyebrow>
          <h2 id="products-heading" className="sois-products-title">
            Top Products
          </h2>
        </div>

        <div className="sois-products-controls">
          <button type="button" aria-label="Previous filters" className="sois-filter-nav" onClick={() => scrollFilters(-1)}>
            <ChevronLeft size={18} />
          </button>
          <div className="sois-product-filters" ref={filtersRef}>
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                aria-pressed={activeFilter === f}
                className={`prod-tab sois-touch-target${activeFilter === f ? " active" : ""}`}
              >
                {f}
              </button>
            ))}
          </div>
          <button type="button" aria-label="More filters" className="sois-filter-nav" onClick={() => scrollFilters(1)}>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="sois-products-grid" aria-hidden="true">
          {Array.from({ length: MAX_CARDS }).map((_, i) => (
            <article key={i} className="sois-pcard">
              <div className="sois-pcard-img" style={{ aspectRatio: "1 / 1", background: T.surface }} />
              <div className="sois-pcard-body">
                <div style={{ height: 12, width: "60%", marginBottom: 8, background: T.surface, borderRadius: 4 }} />
                <div style={{ height: 16, width: "85%", background: T.surface, borderRadius: 4 }} />
              </div>
            </article>
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="sois-products-empty" style={{ padding: "2rem 0", color: T.muted }}>
          No products to show here yet.
        </p>
      ) : (
        <div className={`sois-products-grid${switching ? " sois-switch" : ""}`}>
          {visible.map((p) => {
            const wished = isInWishlist(p.id);
            const showHover = hoveredId === p.id && !!p.hoverImage;
            return (
              <article key={p.id} className="sois-pcard">
                <div
                  className="sois-pcard-img"
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <Image
                    className="pc-img"
                    src={p.images[0]}
                    alt={p.name}
                    fill
                    sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 24vw"
                    style={{ objectFit: "contain", opacity: showHover ? 0 : 1, transition: "opacity 300ms ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
                  />
                  {p.hoverImage && (
                    <Image
                      className="pc-img"
                      src={p.hoverImage}
                      alt={p.name}
                      fill
                      sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 24vw"
                      style={{
                        position: "absolute",
                        inset: 0,
                        objectFit: "contain",
                        opacity: showHover ? 1 : 0,
                        transition: "opacity 300ms ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    />
                  )}
                  <Link
                    href={`/product/${p.slug}`}
                    aria-label={p.name}
                    style={{ position: "absolute", inset: 0, zIndex: 1 }}
                  />
                  {p.badge && (
                    <span
                      className="sois-pcard-tag"
                      style={{ ...badgeColors(p.badge), zIndex: 2 }}
                    >
                      {p.badge.toUpperCase()}
                    </span>
                  )}
                  {!p.inStock && <span className="sois-scard-oos" style={{ zIndex: 2 }}>SOLD OUT</span>}
                  <button
                    type="button"
                    aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                    onClick={(e) => toggleWishlist(e, p)}
                    className="sois-touch-target sois-pcard-heart"
                    style={{ background: wished ? T.sage : "rgba(255,255,255,0.94)", zIndex: 2 }}
                  >
                    <Heart size={15} className={heartAnim === p.id ? "heart-pop" : ""} fill={wished ? T.forest : "none"} color={T.forest} />
                  </button>
                </div>

                <div className="sois-pcard-body">
                  <div className="sois-pcard-sub">{p.subtitle}</div>
                  <Link href={`/product/${p.slug}`} className="sois-pcard-name" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                    {p.name}
                  </Link>
                  <div className="sois-pcard-price-row">
                    <span className="sois-pcard-price">{formatPrice(p.price)}</span>
                    {p.originalPrice && <span className="sois-pcard-orig">{formatPrice(p.originalPrice)}</span>}
                    {p.originalPrice && <span className="sois-pcard-save">SALE</span>}
                  </div>
                  {p.hasSizes ? (
                    // Sized products need a size chosen first, so this links to the PDP's
                    // size selector rather than adding straight to the bag.
                    <Link
                      href={`/product/${p.slug}`}
                      className="sois-pcard-add sois-touch-target"
                      style={!p.inStock ? { opacity: 0.5, pointerEvents: "none" } : undefined}
                    >
                      <ShoppingBag size={14} /> {p.inStock ? "ADD TO BAG" : "SOLD OUT"}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="sois-pcard-add sois-touch-target"
                      disabled={!p.inStock}
                      style={!p.inStock ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
                      onClick={(e) => handleAddToCart(e, p)}
                    >
                      <ShoppingBag size={14} /> {p.inStock ? "ADD TO BAG" : "SOLD OUT"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div className="sois-social-proof">
        <div className="sois-social-proof-copy">
          <span className="sois-social-proof-title">Hallmarked 925 Sterling Silver</span>
          <span className="sois-social-proof-text">Signature collections handcrafted for the modern wardrobe. Built to outlast every trend.</span>
        </div>
        <div className="sois-social-proof-items">
          {["🔒 Secure checkout", "📦 Ships within 24h", "↩ Free returns"].map((item) => (
            <span key={item} className="sois-social-proof-item">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="sois-products-cta">
        <Link href="/shop" className="sois-touch-target sois-products-cta-link">
          VIEW FULL COLLECTION <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  );
}
