"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Heart, ShoppingBag } from "lucide-react";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { products } from "@/lib/data";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

// "₹1,299" -> 1299
const parsePrice = (price: string) =>
  parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;

// Homepage product names map 1:1 to catalogue slugs (see src/lib/catalog.ts)
const toSlug = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function Products() {
  const [heartAnim, setHeartAnim] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [switching, setSwitching] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const filters = ["All", "New Arrivals", "Best Sellers", "On Sale"];

  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const productId = (i: number) => `sois-prod-${i}`;

  const handleAddToCart = (e: React.MouseEvent, p: (typeof products)[number], i: number) => {
    e.stopPropagation();
    addToCart({
      id: productId(i),
      name: p.name,
      price: parsePrice(p.price),
      image: p.img,
    });
  };

  const toggleWishlist = (e: React.MouseEvent, p: (typeof products)[number], i: number) => {
    e.stopPropagation();
    addToWishlist({
      id: productId(i),
      name: p.name,
      price: parsePrice(p.price),
      image: p.img,
    });
    setHeartAnim(i);
    setTimeout(() => setHeartAnim(null), 420);
  };

  const filteredProducts = products
    .map((p, i) => ({ ...p, i }))
    .filter((p) => p.categories.includes(activeFilter as any));

  const scrollFilters = (dir: number) => {
    const el = filtersRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 140, behavior: "smooth" });
  };

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
            {filters.map((f) => (
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

      <div className={`sois-products-grid${switching ? " sois-switch" : ""}`}>
        {filteredProducts.map((p) => (
          <article key={p.i} className="sois-pcard">
            <div className="sois-pcard-img">
              <Image
                className="pc-img"
                src={p.img}
                alt={p.name}
                fill
                sizes="(max-width: 600px) 50vw, (max-width: 1024px) 33vw, 24vw"
                style={{ objectFit: "cover" }}
              />
              <Link
                href={`/product/${toSlug(p.name)}`}
                aria-label={p.name}
                style={{ position: "absolute", inset: 0, zIndex: 1 }}
              />
              <span
                className="sois-pcard-tag"
                style={{ background: p.isNew ? T.forest : "rgba(255,255,255,0.94)", color: p.isNew ? T.sage : T.forest, zIndex: 2 }}
              >
                {p.tag.toUpperCase()}
              </span>
              <button
                type="button"
                aria-label="Add to wishlist"
                onClick={(e) => toggleWishlist(e, p, p.i)}
                className="sois-touch-target sois-pcard-heart"
                style={{ background: isInWishlist(productId(p.i)) ? T.sage : "rgba(255,255,255,0.94)", zIndex: 2 }}
              >
                <Heart size={15} className={heartAnim === p.i ? "heart-pop" : ""} fill={isInWishlist(productId(p.i)) ? T.forest : "none"} color={T.forest} />
              </button>
            </div>

            <div className="sois-pcard-body">
              <div className="sois-pcard-sub">{p.subtitle}</div>
              <Link href={`/product/${toSlug(p.name)}`} className="sois-pcard-name" style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                {p.name}
              </Link>
              <div className="sois-pcard-price-row">
                <span className="sois-pcard-price">{p.price}</span>
                {p.original && <span className="sois-pcard-orig">{p.original}</span>}
                {p.original && <span className="sois-pcard-save">SALE</span>}
              </div>
              <button
                type="button"
                className="sois-pcard-add sois-touch-target"
                onClick={(e) => handleAddToCart(e, p, p.i)}
              >
                <ShoppingBag size={14} /> ADD TO BAG
              </button>
            </div>
          </article>
        ))}
      </div>

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
