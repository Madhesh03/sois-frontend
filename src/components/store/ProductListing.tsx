"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Check } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import {
  Product,
  CategorySlug,
  FilterState,
  SortKey,
  emptyFilters,
  filterProducts,
  sortProducts,
  categories as ALL_CATEGORIES,
} from "@/lib/catalog";

interface PricePreset {
  label: string;
  min: number | null;
  max: number | null;
}

const PRICE_PRESETS: PricePreset[] = [
  { label: "Any price", min: null, max: null },
  { label: "Under ₹800", min: null, max: 799 },
  { label: "₹800 – ₹1,200", min: 800, max: 1200 },
  { label: "₹1,200 – ₹1,800", min: 1200, max: 1800 },
  { label: "Over ₹1,800", min: 1801, max: null },
];

const BADGE_OPTIONS: { key: "new" | "best" | "sale"; label: string }[] = [
  { key: "new", label: "New Arrivals" },
  { key: "best", label: "Best Sellers" },
  { key: "sale", label: "On Sale" },
];

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Alphabetical" },
];

interface ProductListingProps {
  products: Product[];
  /** Hide the category filter block (already scoped, e.g. on a category page). */
  showCategoryFilter?: boolean;
  /** Optional search query used to further narrow the base set. */
  query?: string;
}

export function ProductListing({
  products,
  showCategoryFilter = true,
  query,
}: ProductListingProps) {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [sort, setSort] = useState<SortKey>("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read the live URL query so searching while already on this page re-filters
  // immediately (falls back to the server-provided prop for the first render).
  const searchParams = useSearchParams();
  const q = (searchParams.get("q") ?? query ?? "").trim().toLowerCase();

  const results = useMemo(() => {
    let base = products;
    if (q) {
      base = base.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return sortProducts(filterProducts(base, filters), sort);
  }, [products, filters, sort, q]);

  const activeCount =
    filters.categories.length +
    filters.badges.length +
    (filters.availability === "in-stock" ? 1 : 0) +
    (filters.priceMin != null || filters.priceMax != null ? 1 : 0);

  const toggleCategory = (slug: CategorySlug) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(slug)
        ? f.categories.filter((c) => c !== slug)
        : [...f.categories, slug],
    }));

  const toggleBadge = (key: "new" | "best" | "sale") =>
    setFilters((f) => ({
      ...f,
      badges: f.badges.includes(key)
        ? f.badges.filter((b) => b !== key)
        : [...f.badges, key],
    }));

  const setPrice = (p: PricePreset) =>
    setFilters((f) => ({ ...f, priceMin: p.min, priceMax: p.max }));

  const activePreset = PRICE_PRESETS.find(
    (p) => p.min === filters.priceMin && p.max === filters.priceMax
  );

  const filterPanel = (
    <div className="sois-filters-inner">
      {showCategoryFilter && (
        <div className="sois-filter-group">
          <div className="sois-filter-title">Category</div>
          {ALL_CATEGORIES.map((c) => (
            <label key={c.slug} className="sois-filter-opt">
              <input
                type="checkbox"
                checked={filters.categories.includes(c.slug)}
                onChange={() => toggleCategory(c.slug)}
              />
              <span className="sois-filter-box" aria-hidden="true">
                <Check size={12} />
              </span>
              {c.name}
            </label>
          ))}
        </div>
      )}

      <div className="sois-filter-group">
        <div className="sois-filter-title">Price</div>
        {PRICE_PRESETS.map((p) => (
          <label key={p.label} className="sois-filter-opt">
            <input
              type="radio"
              name="price"
              checked={(activePreset ?? PRICE_PRESETS[0]).label === p.label}
              onChange={() => setPrice(p)}
            />
            <span className="sois-filter-radio" aria-hidden="true" />
            {p.label}
          </label>
        ))}
      </div>

      <div className="sois-filter-group">
        <div className="sois-filter-title">Collection</div>
        {BADGE_OPTIONS.map((b) => (
          <label key={b.key} className="sois-filter-opt">
            <input
              type="checkbox"
              checked={filters.badges.includes(b.key)}
              onChange={() => toggleBadge(b.key)}
            />
            <span className="sois-filter-box" aria-hidden="true">
              <Check size={12} />
            </span>
            {b.label}
          </label>
        ))}
      </div>

      <div className="sois-filter-group">
        <div className="sois-filter-title">Availability</div>
        <label className="sois-filter-opt">
          <input
            type="checkbox"
            checked={filters.availability === "in-stock"}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                availability: e.target.checked ? "in-stock" : "all",
              }))
            }
          />
          <span className="sois-filter-box" aria-hidden="true">
            <Check size={12} />
          </span>
          In stock only
        </label>
      </div>

      {activeCount > 0 && (
        <button
          type="button"
          className="sois-filter-clear"
          onClick={() => setFilters(emptyFilters)}
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="sois-listing-layout">
      {/* Desktop sidebar */}
      <aside className="sois-filters" aria-label="Product filters">
        {filterPanel}
      </aside>

      <div className="sois-listing-main">
        <div className="sois-listing-toolbar">
          <button
            type="button"
            className="sois-filter-toggle sois-touch-target"
            onClick={() => setMobileOpen(true)}
          >
            <SlidersHorizontal size={16} /> Filters
            {activeCount > 0 && (
              <span className="sois-filter-count">{activeCount}</span>
            )}
          </button>

          <span className="sois-listing-count">
            {results.length} {results.length === 1 ? "item" : "items"}
          </span>

          <label className="sois-sort">
            <span className="sois-sort-label">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {results.length === 0 ? (
          <div className="sois-empty">
            <p className="sois-empty-title">No products found</p>
            <p className="sois-empty-sub">
              Try adjusting your filters{q ? " or search" : ""} to see more.
            </p>
          </div>
        ) : (
          <div className="sois-grid">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      {mobileOpen && (
        <>
          <div
            className="sois-filter-overlay"
            onClick={() => setMobileOpen(false)}
          />
          <div className="sois-filter-drawer" role="dialog" aria-modal="true" aria-label="Filters">
            <div className="sois-filter-drawer-head">
              <span>Filters</span>
              <button
                type="button"
                aria-label="Close filters"
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} />
              </button>
            </div>
            <div className="sois-filter-drawer-body">{filterPanel}</div>
            <div className="sois-filter-drawer-foot">
              <button
                type="button"
                className="sois-filter-apply"
                onClick={() => setMobileOpen(false)}
              >
                Show {results.length} {results.length === 1 ? "item" : "items"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
