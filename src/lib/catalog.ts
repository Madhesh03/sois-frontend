import { I } from "./data";

/**
 * Product catalogue data layer.
 *
 * This module is the single seam between the UI and the product data. Today it
 * returns in-memory mock data synchronously; to move to a real API later,
 * replace the bodies of the exported `get*` / `search*` helpers with `fetch`
 * calls (and make them async) — the page/components only depend on these
 * functions and the `Product` / `Category` shapes, not on the data source.
 */

export type CategorySlug =
  | "rings"
  | "earrings"
  | "necklaces"
  | "bracelets"
  | "anklets"
  | "sets"
  | "gifts";

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: CategorySlug;
  price: number;
  originalPrice: number | null;
  sku: string;
  images: string[];
  /**
   * Shown in place of `images[0]` when a shopper hovers the product card — a
   * second look (worn on-model, a different angle) that helps them decide
   * without clicking through. Falls back to `images[1]` when not set
   * explicitly, so a product with 2+ photos gets the effect for free.
   */
  hoverImage?: string;
  /** Optional 360° spin video shown as an extra media item in the gallery. */
  video360?: string;
  description: string;
  specifications: ProductSpec[];
  silverDetails: string;
  care: string[];
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  rating: number;
  reviewCount: number;
  /** Marketing badge shown on the card — derived, never hand-set. */
  badge: "New" | "Best Seller" | "Sale" | null;
  /** True when the product is offered in discrete sizes (rings, bangles). */
  hasSizes?: boolean;
  /** Size unit label, e.g. "US". */
  sizeUnit?: string;
  /** What the variant axis is called, e.g. "Size" or "Length". */
  variantLabel?: string;
  /**
   * Per-size availability. Only populated on product detail (the list API
   * doesn't carry per-size counts); on cards only `hasSizes` is known.
   */
  sizes?: ProductSize[];
}

export interface ProductSize {
  size: string;
  qty: number;
  inStock: boolean;
}

export const categories: Category[] = [
  {
    slug: "rings",
    name: "Rings",
    tagline: "Stackable bands & statement silhouettes",
    image: I.ringWhite,
  },
  {
    slug: "earrings",
    name: "Earrings",
    tagline: "Hoops, studs & elegant drops",
    image: I.earrings,
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    tagline: "Pendants & layering chains",
    image: I.necklace,
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    tagline: "Chains, cuffs & charm bracelets",
    image: I.bracelets,
  },
  {
    slug: "anklets",
    name: "Anklets",
    tagline: "Delicate everyday anklets",
    image: I.anklets,
  },
  {
    slug: "sets",
    name: "Sets",
    tagline: "Matching pieces, made to wear together",
    image: I.necklace,
  },
  {
    slug: "gifts",
    name: "Gift Collections",
    tagline: "Curated sets for every occasion",
    image: I.heartPend,
  },
];

const CARE_DEFAULT = [
  "Store in the provided anti-tarnish pouch when not being worn.",
  "Keep away from perfume, lotion and water to preserve the shine.",
  "Polish gently with a soft silver cloth to restore lustre.",
  "Remove before swimming, bathing or exercising.",
];

const SILVER_DEFAULT =
  "Crafted from hallmarked 925 sterling silver — 92.5% pure silver finished with a durable rhodium plating that resists tarnish. Nickel-free and hypoallergenic, so it stays gentle on sensitive skin.";

/** Concise seed rows — expanded into full `Product` objects by `build()`. */
interface Seed {
  name: string;
  category: CategorySlug;
  price: number;
  originalPrice?: number;
  images: string[];
  /** Explicit hover-image override; defaults to images[1] in buildProducts(). */
  hoverImage?: string;
  description: string;
  specs: ProductSpec[];
  video360?: string;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  rating: number;
  reviewCount: number;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Offline demo sizing for rings — one size intentionally out of stock so the
// size selector's disabled/out-of-stock state is visible without the backend.
const MOCK_RING_SIZES: ProductSize[] = [
  { size: "6", qty: 4, inStock: true },
  { size: "7", qty: 6, inStock: true },
  { size: "8", qty: 0, inStock: false },
  { size: "9", qty: 3, inStock: true },
];

function build(seeds: Seed[]): Product[] {
  return seeds.map((s, i) => {
    const onSale = s.originalPrice != null && s.originalPrice > s.price;
    const badge: Product["badge"] = s.isNew
      ? "New"
      : s.isBestSeller
        ? "Best Seller"
        : onSale
          ? "Sale"
          : null;
    const catCode = s.category.slice(0, 3).toUpperCase();
    // Rings are offered in sizes in the mock catalogue (mirrors the backend's
    // per-size stock for sized products).
    const sized = s.category === "rings";
    return {
      id: `sois-${slugify(s.name)}`,
      slug: slugify(s.name),
      name: s.name,
      subtitle: "Sterling Silver · 925",
      category: s.category,
      price: s.price,
      originalPrice: onSale ? s.originalPrice! : null,
      sku: `SOIS-${catCode}-${String(i + 1).padStart(3, "0")}`,
      images: s.images,
      hoverImage: s.hoverImage ?? s.images[1],
      video360: s.video360,
      description: s.description,
      specifications: [
        { label: "Metal", value: "925 Sterling Silver" },
        { label: "Finish", value: "Rhodium-plated · Tarnish-resistant" },
        ...s.specs,
        { label: "Hallmark", value: "925 BIS Hallmarked" },
      ],
      silverDetails: SILVER_DEFAULT,
      care: CARE_DEFAULT,
      inStock: s.inStock ?? true,
      isNew: s.isNew ?? false,
      isBestSeller: s.isBestSeller ?? false,
      rating: s.rating,
      reviewCount: s.reviewCount,
      badge,
      hasSizes: sized,
      sizeUnit: sized ? "US" : undefined,
      sizes: sized ? MOCK_RING_SIZES : undefined,
    };
  });
}

// Placeholder 360° turntable footage — swap these for real product spin videos
// when available. Any MP4/WebM URL (or local /public asset) works.
const VIDEO_360_SAMPLE =
  "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const seeds: Seed[] = [
  // ── Rings ──
  {
    name: "Celestial Stack Ring",
    category: "rings",
    price: 899,
    images: [I.prod2, I.ringWhite, I.prod1],
    description:
      "A dainty stackable band with a subtle celestial texture, designed to be worn solo or layered with your favourites for an effortless, modern look.",
    specs: [
      { label: "Band Width", value: "1.8 mm" },
      { label: "Sizing", value: "Adjustable · Fits 6–8" },
    ],
    isNew: true,
    rating: 4.8,
    reviewCount: 126,
  },
  {
    name: "Luminous Signet Ring",
    category: "rings",
    price: 1199,
    originalPrice: 1499,
    images: [I.prod1, I.ringWhite, I.prod4],
    description:
      "A contemporary take on the classic signet — a polished oval face on a substantial band, made to be engraved, gifted and treasured.",
    specs: [
      { label: "Face Size", value: "11 × 9 mm" },
      { label: "Sizing", value: "Available 6–9" },
    ],
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 208,
  },
  {
    name: "Twine Wrap Ring",
    category: "rings",
    price: 749,
    images: [I.ringWhite, I.prod2, I.prod3],
    description:
      "Two fine strands of silver twist into a delicate wrap, catching the light from every angle. An everyday essential with a refined finish.",
    specs: [
      { label: "Band Width", value: "2.2 mm" },
      { label: "Sizing", value: "Adjustable" },
    ],
    rating: 4.7,
    reviewCount: 74,
  },
  {
    name: "Solitaire Halo Ring",
    category: "rings",
    price: 1599,
    originalPrice: 1899,
    images: [I.prod4, I.ringWhite, I.prod1],
    description:
      "A brilliant cubic zirconia solitaire framed by a shimmering halo — timeless sparkle crafted in hallmarked sterling silver.",
    specs: [
      { label: "Stone", value: "5 mm CZ · Halo set" },
      { label: "Sizing", value: "Available 6–9" },
    ],
    rating: 4.9,
    reviewCount: 152,
  },

  // ── Earrings ──
  {
    name: "Cascade Hoop Earrings",
    category: "earrings",
    price: 749,
    originalPrice: 999,
    images: [I.prod3, I.earrings, I.prod2],
    description:
      "Lightweight graduated hoops that fall in a gentle cascade — enough movement to feel special, light enough to wear all day.",
    specs: [
      { label: "Drop Length", value: "32 mm" },
      { label: "Closure", value: "Secure hinged hoop" },
    ],
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 189,
  },
  {
    name: "Ethereal Drop Earrings",
    category: "earrings",
    price: 899,
    originalPrice: 1199,
    images: [I.prod2, I.earrings, I.prod1],
    description:
      "Fluid teardrop silhouettes suspended from a delicate stud, designed to elongate and elevate any neckline.",
    specs: [
      { label: "Drop Length", value: "28 mm" },
      { label: "Closure", value: "Push-back stud" },
    ],
    rating: 4.7,
    reviewCount: 96,
  },
  {
    name: "Petite Orbit Studs",
    category: "earrings",
    price: 599,
    images: [I.earrings, I.prod3, I.prod4],
    description:
      "Minimalist orbit studs that go with everything — the quiet finishing touch to your everyday stack.",
    specs: [
      { label: "Diameter", value: "8 mm" },
      { label: "Closure", value: "Push-back stud" },
    ],
    isNew: true,
    rating: 4.9,
    reviewCount: 231,
  },
  {
    name: "Lumen Huggie Hoops",
    category: "earrings",
    price: 699,
    images: [I.prod1, I.earrings, I.prod2],
    description:
      "Snug pavé-set huggies that hug the lobe with understated sparkle. A modern staple you'll reach for daily.",
    specs: [
      { label: "Diameter", value: "12 mm" },
      { label: "Closure", value: "Hinged huggie" },
    ],
    rating: 4.6,
    reviewCount: 58,
  },

  // ── Necklaces ──
  {
    name: "Crescent Moon Pendant",
    category: "necklaces",
    price: 1299,
    originalPrice: 1599,
    images: [I.prod1, I.necklace, I.prod4],
    video360: VIDEO_360_SAMPLE,
    description:
      "A softly polished crescent suspended on a fine cable chain — our signature pendant and a lasting favourite.",
    specs: [
      { label: "Chain Length", value: "18 in · Adjustable" },
      { label: "Pendant", value: "16 mm crescent" },
      { label: "Clasp", value: "Spring-ring" },
    ],
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 342,
  },
  {
    name: "Twisted Rope Necklace",
    category: "necklaces",
    price: 1499,
    images: [I.prod3, I.necklace, I.prod2],
    description:
      "A substantial twisted-rope chain with beautiful movement and shine — a statement layer that stands on its own.",
    specs: [
      { label: "Chain Length", value: "20 in" },
      { label: "Width", value: "3.5 mm" },
      { label: "Clasp", value: "Lobster" },
    ],
    isNew: true,
    rating: 4.8,
    reviewCount: 87,
  },
  {
    name: "Solene Layer Chain",
    category: "necklaces",
    price: 1099,
    images: [I.necklace, I.prod1, I.prod3],
    description:
      "A whisper-fine chain built for layering. Wear alone for minimalist ease or stack for depth and dimension.",
    specs: [
      { label: "Chain Length", value: "16 in · Adjustable" },
      { label: "Width", value: "1.2 mm" },
      { label: "Clasp", value: "Spring-ring" },
    ],
    rating: 4.7,
    reviewCount: 64,
  },
  {
    name: "Aurora Pearl Drop Necklace",
    category: "necklaces",
    price: 1799,
    originalPrice: 2099,
    images: [I.prod4, I.necklace, I.prod2],
    description:
      "A single freshwater pearl drop on a delicate silver chain — quiet luxury for occasions that matter.",
    specs: [
      { label: "Chain Length", value: "18 in" },
      { label: "Pendant", value: "8 mm freshwater pearl" },
      { label: "Clasp", value: "Lobster" },
    ],
    rating: 4.9,
    reviewCount: 118,
  },

  // ── Bracelets ──
  {
    name: "Starlight Chain Bracelet",
    category: "bracelets",
    price: 1099,
    images: [I.prod4, I.bracelets, I.prod1],
    description:
      "A fluid chain bracelet scattered with tiny faceted links that catch the light like starlight across the wrist.",
    specs: [
      { label: "Length", value: "7 in · Adjustable" },
      { label: "Clasp", value: "Lobster + extender" },
    ],
    isNew: true,
    rating: 4.8,
    reviewCount: 103,
  },
  {
    name: "Cubic Charm Bracelet",
    category: "bracelets",
    price: 999,
    originalPrice: 1299,
    images: [I.prod2, I.bracelets, I.prod3],
    description:
      "A delicate chain punctuated by a sparkling cubic charm — playful, polished and perfect for stacking.",
    specs: [
      { label: "Length", value: "6.5 in · Adjustable" },
      { label: "Clasp", value: "Spring-ring" },
    ],
    rating: 4.6,
    reviewCount: 71,
  },
  {
    name: "Eterna Cuff Bracelet",
    category: "bracelets",
    price: 1399,
    images: [I.bracelets, I.prod4, I.prod2],
    description:
      "A smooth open cuff with a sculptural, minimalist form. Slips on easily and holds its shape beautifully.",
    specs: [
      { label: "Fit", value: "Open cuff · One size" },
      { label: "Width", value: "4 mm" },
    ],
    isBestSeller: true,
    rating: 4.8,
    reviewCount: 140,
  },

  // ── Anklets ──
  {
    name: "Seaside Beaded Anklet",
    category: "anklets",
    price: 649,
    images: [I.anklets, I.prod3, I.prod1],
    video360: VIDEO_360_SAMPLE,
    description:
      "Tiny silver beads strung on a fine chain for a barely-there anklet that catches the sun with every step.",
    specs: [
      { label: "Length", value: "9–10 in · Adjustable" },
      { label: "Clasp", value: "Spring-ring + extender" },
    ],
    isNew: true,
    rating: 4.7,
    reviewCount: 52,
  },
  {
    name: "Petal Charm Anklet",
    category: "anklets",
    price: 699,
    originalPrice: 899,
    images: [I.prod1, I.anklets, I.prod4],
    description:
      "A dainty chain anklet with a single petal charm — delicate, feminine and made for warm-weather days.",
    specs: [
      { label: "Length", value: "9–10 in · Adjustable" },
      { label: "Clasp", value: "Lobster + extender" },
    ],
    rating: 4.6,
    reviewCount: 39,
  },

  // ── Sets ──
  {
    name: "Radiance Necklace & Earring Set",
    category: "sets",
    price: 1899,
    originalPrice: 2299,
    images: [I.necklace, I.earrings, I.prod2],
    description:
      "A matching pendant necklace and drop earrings designed to be worn together — an effortless, coordinated look in hallmarked sterling silver.",
    specs: [
      { label: "Set Includes", value: "Necklace + Earrings" },
      { label: "Chain Length", value: "16 in + 2 in extender" },
    ],
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 84,
  },
  {
    name: "Aurora Bridal Jewellery Set",
    category: "sets",
    price: 3299,
    originalPrice: 3999,
    images: [I.heartPend, I.necklace, I.ringWhite],
    description:
      "A three-piece set — necklace, earrings and a matching ring — crafted for weddings and special moments that deserve a coordinated shine.",
    specs: [
      { label: "Set Includes", value: "Necklace + Earrings + Ring" },
      { label: "Sizing", value: "Ring available 6–9" },
    ],
    isNew: true,
    rating: 4.9,
    reviewCount: 47,
  },
  {
    name: "Everyday Layering Set",
    category: "sets",
    price: 1499,
    images: [I.prod3, I.necklace, I.prod1],
    description:
      "Two complementary chains made to layer beautifully, plus a pair of studs — your everyday stack, ready to wear straight from the box.",
    specs: [
      { label: "Set Includes", value: "2 Chains + Studs" },
      { label: "Finish", value: "Rhodium-plated · Tarnish-resistant" },
    ],
    rating: 4.7,
    reviewCount: 63,
  },

  // ── Gift Collections ──
  {
    name: "Everyday Essentials Gift Set",
    category: "gifts",
    price: 2499,
    originalPrice: 3199,
    images: [I.heartPend, I.prod2, I.prod3],
    description:
      "A thoughtfully curated trio — studs, a fine chain and a stackable ring — presented in a premium gift box. The perfect way to gift SOIS.",
    specs: [
      { label: "Set Includes", value: "Studs + Chain + Ring" },
      { label: "Packaging", value: "Premium gift box + card" },
    ],
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 96,
  },
  {
    name: "Celestial Duo Gift Set",
    category: "gifts",
    price: 1999,
    images: [I.prod1, I.heartPend, I.necklace],
    description:
      "Our crescent pendant paired with matching orbit studs — a celestial duo boxed and ready to gift.",
    specs: [
      { label: "Set Includes", value: "Pendant + Studs" },
      { label: "Packaging", value: "Premium gift box + card" },
    ],
    isNew: true,
    rating: 4.8,
    reviewCount: 61,
  },
];

/**
 * Offline fallback catalogue. The `get*`/`search*` helpers below fetch from the
 * live backend (`src/lib/api`); when the API is unreachable (e.g. local dev
 * without the backend running, or during static builds) they fall back to this
 * seeded data so the storefront still renders.
 */
const MOCK_PRODUCTS: Product[] = build(seeds);

// ── Data-access helpers (API-backed, with an offline fallback) ──
//
// These are async because they call the backend consumer API. UI components
// that consume them must `await` (server components) or fetch in an effect
// (client components).

/** Fetch the full catalogue (mapped to the UI shape), falling back to mock data. */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { catalogApi, mapListItem } = await import("@/lib/api");
    const { items } = await catalogApi.listProducts({ page_size: 200 });
    return items.map(mapListItem);
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | undefined> {
  try {
    const { catalogApi, mapDetail } = await import("@/lib/api");
    return mapDetail(await catalogApi.getProduct(slug));
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug);
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const { catalogApi, mapCategory } = await import("@/lib/api");
    const cats = await catalogApi.listCategories();
    const mapped = cats.map(mapCategory);
    // Keep the storefront nav complete even if the backend omits some.
    return mapped.length ? mapped : categories;
  } catch {
    return categories;
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | undefined> {
  const all = await getCategories();
  return all.find((c) => c.slug === slug);
}

export async function getCategoryCount(slug: CategorySlug): Promise<number> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === slug).length;
}

export async function getProductsByCategory(
  slug: CategorySlug
): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.category === slug);
}

/** Top-selling products for the homepage "Top Products" section. */
export async function getTopProducts(limit = 8): Promise<Product[]> {
  try {
    const { catalogApi, mapListItem } = await import("@/lib/api");
    const items = await catalogApi.listTopProducts(limit);
    if (items.length) return items.map(mapListItem);
  } catch {
    // fall through to the offline fallback
  }
  // Offline fallback: best sellers first, then featured, capped at `limit`.
  return sortProducts(MOCK_PRODUCTS, "featured").slice(0, limit);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  try {
    const { catalogApi, mapListItem } = await import("@/lib/api");
    const items = await catalogApi.listRelatedProducts(product.slug, limit);
    if (items.length) return items.map(mapListItem);
  } catch {
    // fall through to the offline fallback
  }
  const all = await getAllProducts();
  return all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

/**
 * Hydrate recently-viewed product IDs (stored client-side) into full cards,
 * preserving the given order and excluding `excludeId` (usually the product
 * currently being viewed). See `src/lib/recentlyViewed.ts`.
 */
export async function getProductsByIds(
  ids: string[],
  excludeId?: string
): Promise<Product[]> {
  const wanted = ids.filter((id) => id && id !== excludeId);
  if (!wanted.length) return [];
  try {
    const { catalogApi, mapListItem } = await import("@/lib/api");
    const items = await catalogApi.listProductsByIds(wanted);
    return items.map(mapListItem);
  } catch {
    return MOCK_PRODUCTS.filter(
      (p) => wanted.includes(p.id) && p.id !== excludeId
    );
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];
  try {
    const { catalogApi, mapListItem } = await import("@/lib/api");
    const { items } = await catalogApi.listProducts({ q, page_size: 50 });
    return items.map(mapListItem);
  } catch {
    const needle = q.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(needle) ||
        p.category.toLowerCase().includes(needle) ||
        p.description.toLowerCase().includes(needle)
    );
  }
}

// ── Pure filter/sort helpers used by the listing UI ──

export type SortKey =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "newest"
  | "name";

export interface FilterState {
  categories: CategorySlug[];
  priceMin: number | null;
  priceMax: number | null;
  availability: "all" | "in-stock";
  badges: ("new" | "best" | "sale")[];
}

export const emptyFilters: FilterState = {
  categories: [],
  priceMin: null,
  priceMax: null,
  availability: "all",
  badges: [],
};

export function priceBounds(products: Product[]): { min: number; max: number } {
  if (!products.length) return { min: 0, max: 0 };
  const prices = products.map((p) => p.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function filterProducts(
  products: Product[],
  f: FilterState
): Product[] {
  return products.filter((p) => {
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.priceMin != null && p.price < f.priceMin) return false;
    if (f.priceMax != null && p.price > f.priceMax) return false;
    if (f.availability === "in-stock" && !p.inStock) return false;
    if (f.badges.length) {
      const matches =
        (f.badges.includes("new") && p.isNew) ||
        (f.badges.includes("best") && p.isBestSeller) ||
        (f.badges.includes("sale") && p.originalPrice != null);
      if (!matches) return false;
    }
    return true;
  });
}

export function sortProducts(products: Product[], sort: SortKey): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "newest":
      return list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return list.sort(
        (a, b) =>
          Number(b.isBestSeller) - Number(a.isBestSeller) ||
          b.reviewCount - a.reviewCount
      );
  }
}

export function formatPrice(value: number): string {
  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Card badge colours, keyed by the badge text itself (not just "is it new")
 * so New / Best Seller / Sale read as visually distinct tags rather than the
 * same pill with different words in it.
 */
export function badgeColors(
  badge: Product["badge"]
): { background: string; color: string } {
  switch (badge) {
    case "New":
      return { background: "#115E59", color: "#D1FAE5" };
    case "Best Seller":
      return { background: "#B7791F", color: "#FFFFFF" };
    case "Sale":
      return { background: "#D4183D", color: "#FFFFFF" };
    default:
      return { background: "rgba(255,255,255,0.94)", color: "#115E59" };
  }
}
