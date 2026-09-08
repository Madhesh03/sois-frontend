"use client";

import { useEffect, useState } from "react";
import { Product, getProductsByIds } from "@/lib/catalog";
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";
import { ProductCard } from "@/components/store/ProductCard";

/**
 * "Recently viewed" strip. Reads the client-stored ID history and hydrates it
 * with fresh product data via the batch endpoint. `excludeId` drops the product
 * currently on screen. Renders nothing until at least one item resolves, so it
 * never leaves an empty heading on the page.
 */
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = getRecentlyViewedIds();
    if (!ids.length) return;
    let active = true;
    getProductsByIds(ids, excludeId)
      .then((items) => {
        if (active) setProducts(items);
      })
      .catch(() => {
        /* best-effort — leave the strip hidden on failure */
      });
    return () => {
      active = false;
    };
  }, [excludeId]);

  if (!products.length) return null;

  return (
    <section className="sois-pdp-related">
      <h2 className="sois-pdp-related-title">Recently viewed</h2>
      <div className="sois-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
