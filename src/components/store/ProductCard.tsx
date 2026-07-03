"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Heart } from "lucide-react";
import { Product, formatPrice } from "@/lib/catalog";
import { T } from "@/lib/tokens";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const wished = isInWishlist(product.id);

  const cartPayload = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.images[0],
  };

  return (
    <article className="sois-scard">
      <div className="sois-pcard-img">
        <Link
          href={`/product/${product.slug}`}
          aria-label={product.name}
          style={{ position: "relative", display: "block", width: "100%", height: "100%" }}
        >
          <Image
            className="pc-img"
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ objectFit: "cover" }}
          />
        </Link>

        {product.badge && (
          <span
            className="sois-pcard-tag"
            style={{
              background: product.isNew
                ? T.forest
                : "rgba(255,255,255,0.94)",
              color: product.isNew ? T.sage : T.forest,
            }}
          >
            {product.badge.toUpperCase()}
          </span>
        )}

        {!product.inStock && (
          <span className="sois-scard-oos">SOLD OUT</span>
        )}

        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          onClick={() => addToWishlist(cartPayload)}
          className="sois-touch-target sois-pcard-heart"
          style={{
            background: wished ? T.sage : "rgba(255,255,255,0.94)",
          }}
        >
          <Heart
            size={15}
            fill={wished ? T.forest : "none"}
            color={T.forest}
          />
        </button>
      </div>

      <div className="sois-pcard-body">
        <div className="sois-pcard-sub">{product.subtitle}</div>
        <Link href={`/product/${product.slug}`} className="sois-scard-name-link">
          <div className="sois-pcard-name">{product.name}</div>
        </Link>
        <div className="sois-pcard-price-row">
          <span className="sois-pcard-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="sois-pcard-orig">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          {product.originalPrice && <span className="sois-pcard-save">SALE</span>}
        </div>
        <button
          type="button"
          className="sois-pcard-add sois-touch-target"
          disabled={!product.inStock}
          style={!product.inStock ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          onClick={() => product.inStock && addToCart(cartPayload)}
        >
          <ShoppingBag size={14} /> {product.inStock ? "ADD TO BAG" : "SOLD OUT"}
        </button>
      </div>
    </article>
  );
}
