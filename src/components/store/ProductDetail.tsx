"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Share2,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Rotate3d,
  Ruler,
} from "lucide-react";
import { Product, formatPrice, categories, badgeColors } from "@/lib/catalog";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";

/** Ring-band-with-solitaire outline, drawn behind the size number so a size swatch reads as a ring rather than a plain circle/square. */
function RingSizeIcon() {
  return (
    <svg viewBox="0 0 48 54" className="sois-pdp-size-icon" aria-hidden="true">
      <circle cx="24" cy="32" r="17" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M17.5 18.5 L14 23 M30.5 18.5 L34 23"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M24 4 L29 11 L24 18 L19 11 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
import { useWishlist } from "@/context/WishlistContext";
import { ProductCard } from "@/components/store/ProductCard";
import { RecentlyViewed } from "@/components/store/RecentlyViewed";
import { Modal } from "@/components/modals/Modal";
import { recordRecentlyViewed } from "@/lib/recentlyViewed";

export function ProductDetail({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const { items, addToCart, updateQuantity } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState<string | null>("details");
  const [shareMsg, setShareMsg] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [sizeError, setSizeError] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  // Log this product to the client-side recently-viewed history (used by the
  // strip below and on other product pages). Re-runs when the product changes.
  useEffect(() => {
    recordRecentlyViewed(product.id);
  }, [product.id]);

  const wished = isInWishlist(product.id);
  const category = categories.find((c) => c.slug === product.category);

  // Sized products (rings, bangles) must have a size chosen before they can be
  // added — each size is its own stocked variant.
  const sizes = product.sizes ?? [];
  const needsSize = Boolean(product.hasSizes) && sizes.length > 0;
  const sizeUnit = product.sizeUnit ? ` (${product.sizeUnit})` : "";
  const chosen = sizes.find((s) => s.size === selectedSize);

  const canPurchase = needsSize
    ? sizes.some((s) => s.inStock)
    : product.inStock;
  const maxQty = Infinity;
  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  // Gallery media = product images plus an optional 360° video as the last item.
  const media: { type: "image" | "video"; src: string }[] = [
    ...product.images.map((src) => ({ type: "image" as const, src })),
    ...(product.video360 ? [{ type: "video" as const, src: product.video360 }] : []),
  ];
  const activeMedia = media[activeImage] ?? media[0];
  const goPrev = () => setActiveImage((i) => (i - 1 + media.length) % media.length);
  const goNext = () => setActiveImage((i) => (i + 1) % media.length);

  const payload = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
    ...(needsSize && selectedSize ? { size: selectedSize } : {}),
  };

  // Mirrors CartContext's lineKeyFor: a sized product is one cart line per size.
  const lineKey =
    needsSize && selectedSize ? `${product.id}::${selectedSize}` : product.id;

  const addChosenQuantity = (): boolean => {
    if (needsSize && !selectedSize) {
      setSizeError(true);
      return false;
    }
    const existing = items.find((i) => i.id === lineKey)?.quantity ?? 0;
    addToCart(payload);
    updateQuantity(lineKey, existing + quantity);
    return true;
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg("Link copied");
        setTimeout(() => setShareMsg(""), 2000);
      }
    } catch {
      /* user dismissed the share sheet */
    }
  };

  const sections: { key: string; title: string; body: React.ReactNode }[] = [
    {
      key: "details",
      title: "Product Details",
      body: <p style={{ margin: 0, lineHeight: 1.7 }}>{product.description}</p>,
    },
    {
      key: "specs",
      title: "Specifications",
      body: (
        <dl className="sois-spec-list">
          {product.specifications
            .filter((s) => s.label.trim().toLowerCase() !== "sku")
            .map((s) => (
              <div key={s.label} className="sois-spec-row">
                <dt>{s.label}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
        </dl>
      ),
    },
    {
      key: "silver",
      title: "Sterling Silver Details",
      body: (
        <p style={{ margin: 0, lineHeight: 1.7 }}>{product.silverDetails}</p>
      ),
    },
    {
      key: "care",
      title: "Care Instructions",
      body: (
        <ul className="sois-care-list">
          {product.care.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <div className="sois-pdp">
      {/* Breadcrumb */}
      <nav className="sois-breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <ChevronRight size={13} />
        <Link href="/shop">Shop</Link>
        {category && (
          <>
            <ChevronRight size={13} />
            <Link href={`/category/${category.slug}`}>{category.name}</Link>
          </>
        )}
        <ChevronRight size={13} />
        <span aria-current="page">{product.name}</span>
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
            {activeMedia.type === "video" ? (
              <video
                key={activeMedia.src}
                className="sois-pdp-video"
                src={activeMedia.src}
                autoPlay
                loop
                muted
                playsInline
                controls
              />
            ) : (
              <Image
                src={activeMedia.src}
                alt={product.name}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                style={{ objectFit: "contain" }}
                priority
              />
            )}

            {product.badge && activeMedia.type === "image" && (
              <span className="sois-pcard-tag" style={badgeColors(product.badge)}>
                {product.badge.toUpperCase()}
              </span>
            )}

            {activeMedia.type === "video" && (
              <span className="sois-pdp-360-badge">
                <Rotate3d size={14} /> 360° View
              </span>
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  className="sois-pdp-nav sois-pdp-nav-prev"
                  aria-label="Previous media"
                  onClick={goPrev}
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="sois-pdp-nav sois-pdp-nav-next"
                  aria-label="Next media"
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
                aria-label={m.type === "video" ? "View 360° video" : `View image ${i + 1}`}
                className={`sois-pdp-thumb${i === activeImage ? " active" : ""}`}
                onClick={() => setActiveImage(i)}
              >
                <Image
                  src={m.type === "video" ? product.images[0] : m.src}
                  alt=""
                  fill
                  sizes="80px"
                  style={{ objectFit: "contain" }}
                />
                {m.type === "video" && (
                  <span className="sois-pdp-thumb-360">
                    <Rotate3d size={16} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="sois-pdp-info">
          <div className="sois-pdp-sub">{product.subtitle}</div>
          <h1 className="sois-pdp-name">{product.name}</h1>

          <div className="sois-pdp-price-row">
            <span className="sois-pdp-price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="sois-pdp-orig">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {discount > 0 && (
              <span className="sois-pdp-save">Save {discount}%</span>
            )}
          </div>

          <div
            className="sois-pdp-stock"
            style={{ color: canPurchase ? T.forest : "#d4183d" }}
          >
            <span
              className="sois-pdp-stock-dot"
              style={{ background: canPurchase ? T.forest : "#d4183d" }}
            />
            {canPurchase ? "In stock" : "Out of stock"}
          </div>

          {/* Size selector — only for sized products (rings, bangles) */}
          {needsSize && (
            <div className="sois-pdp-sizes">
              <div className="sois-pdp-sizes-head">
                <span className="sois-pdp-sizes-label">
                  {product.variantLabel || "Size"}
                  {sizeUnit}
                </span>
                <button
                  type="button"
                  className="sois-pdp-sizechart-link"
                  onClick={() => setChartOpen(true)}
                >
                  <Ruler size={14} /> Size chart
                </button>
              </div>

              <div className="sois-pdp-size-grid" role="group" aria-label="Choose a size">
                {sizes.map((s) => {
                  const active = s.size === selectedSize;
                  return (
                    <button
                      key={s.size}
                      type="button"
                      className={`sois-pdp-size${active ? " active" : ""}${
                        s.inStock ? "" : " oos"
                      }`}
                      disabled={!s.inStock}
                      aria-pressed={active}
                      title={s.inStock ? undefined : `Size ${s.size} is sold out`}
                      onClick={() => {
                        setSelectedSize(s.size);
                        setSizeError(false);
                      }}
                    >
                      <RingSizeIcon />
                      <span className="sois-pdp-size-num">{s.size}</span>
                    </button>
                  );
                })}
              </div>

              {chosen && chosen.qty > 0 && chosen.qty <= 5 && (
                <p className="sois-pdp-sizes-left">
                  Only {chosen.qty} left in size {chosen.size}
                </p>
              )}
              {sizeError && (
                <p className="sois-pdp-size-error" role="alert">
                  Please choose a size before adding to your bag.
                </p>
              )}
            </div>
          )}

          {/* Quantity + actions */}
          <div className="sois-pdp-actions">
            <div className="sois-pdp-qty" aria-label="Quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                disabled={quantity >= maxQty}
                onClick={() => setQuantity((q) => Math.min(q + 1, maxQty))}
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              type="button"
              className="sois-pdp-add"
              disabled={!canPurchase}
              onClick={() => addChosenQuantity()}
            >
              <ShoppingBag size={16} /> Add to Bag
            </button>
          </div>

          <div className="sois-pdp-secondary">
            <button
              type="button"
              onClick={() => addToWishlist(payload)}
              className={wished ? "active" : ""}
            >
              <Heart size={16} fill={wished ? T.forest : "none"} />
              {wished ? "Wishlisted" : "Wishlist"}
            </button>
            <button type="button" onClick={handleShare}>
              <Share2 size={16} />
              {shareMsg || "Share"}
            </button>
          </div>

          {/* Trust row */}
          <div className="sois-pdp-trust">
            <span>
              <ShieldCheck size={16} /> Hallmarked 925
            </span>
          </div>

          {/* Accordion */}
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
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="sois-pdp-related">
          <h2 className="sois-pdp-related-title">You may also like</h2>
          <div className="sois-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Recently viewed — hydrated client-side from localStorage history */}
      <RecentlyViewed excludeId={product.id} />

      {/* Size chart */}
      {needsSize && (
        <Modal
          isOpen={chartOpen}
          onClose={() => setChartOpen(false)}
          title="Size Chart"
          size="lg"
        >
          <div className="sois-sizechart">
            <Image
              src="/ring-size-chart.png"
              alt="Ring size chart — US sizes 3 to 13.5 with inside diameter in millimetres"
              width={1448}
              height={1086}
              className="sois-sizechart-image"
              sizes="(max-width: 800px) 90vw, 750px"
              priority
            />
          </div>
        </Modal>
      )}
    </div>
  );
}
