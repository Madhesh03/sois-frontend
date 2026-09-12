/**
 * Map backend consumer-API shapes onto the UI-facing shapes the components
 * already consume (`Product`, `Category` from `src/lib/catalog.ts`). Keeping the
 * mapping in one place means the components don't need to know the API shape.
 */
import type {
  Category as UICategory,
  CategorySlug,
  Product as UIProduct,
  ProductSpec,
} from "@/lib/catalog";
import { mediaUrl, PLACEHOLDER_IMAGE } from "./media";

/** Shown as the last slide of every product's image gallery. */
const BIS_CERTIFICATE_IMAGE = "/bis-certificate.png";
import type {
  ApiCategory,
  ProductDetail,
  ProductDimension,
  ProductListItem,
  StoneDetail,
} from "./types";

/** UI category slugs the storefront navigation understands. */
const KNOWN_SLUGS: CategorySlug[] = [
  "rings",
  "earrings",
  "necklaces",
  "bracelets",
  "anklets",
  "sets",
  "gifts",
];

/** Coerce an arbitrary API category slug/name to a known UI slug. */
export function toCategorySlug(
  slug: string | null | undefined,
  name?: string | null
): CategorySlug {
  const candidate = (slug || name || "").toLowerCase().trim();
  if (!candidate) return "gifts";

  // An exact (or simple singular/plural) match must be tried against EVERY
  // known slug before any substring test: one slug contains another —
  // "earrings" contains "rings" — so a substring pass ordered by KNOWN_SLUGS
  // would file the backend's "Earrings" category under rings.
  const exact = KNOWN_SLUGS.find(
    (s) => candidate === s || `${s}s` === candidate || `${candidate}s` === s
  );
  if (exact) return exact;

  return KNOWN_SLUGS.find((s) => candidate.includes(s)) ?? "gifts";
}

const METAL_LABELS: Record<string, string> = {
  silver: "Sterling Silver · 925",
  gold: "Gold",
  gold_plated: "Gold Plated",
  rose_gold: "Rose Gold",
  antique: "Antique",
  other: "Fine Jewellery",
};

function subtitleFor(metalType: string, purity: string): string {
  const label = METAL_LABELS[metalType] ?? "Fine Jewellery";
  return purity ? `${label} · ${purity}`.replace("· 925 · ", "· ") : label;
}

// Normalise a tag to its bare alphanumerics so spacing/casing/punctuation
// don't matter: "New Arrivals", "new-arrivals" and "newarrivals" all collapse
// to "newarrivals".
const normTag = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

// Free-text admin tags that map onto each storefront merchandising bucket.
// Whatever staff type on the product ("New Arrivals", "best selling",
// "bestselling", …) lands it in the matching section. Values are stored
// normalised so the match is space/case/punctuation-insensitive.
export const TAG_ALIASES = {
  new: ["new", "newarrival", "newarrivals"],
  bestSeller: ["bestseller", "bestsellers", "bestselling"],
  sale: ["sale", "onsale"],
} as const;

/** Whether any of a product's tags falls into the given alias bucket. */
export function hasTag(
  tags: readonly string[] | undefined,
  aliases: readonly string[]
): boolean {
  if (!tags?.length) return false;
  const norm = tags.map(normTag);
  return aliases.some((a) => norm.includes(a));
}

function derivedBadge(opts: {
  isFeatured: boolean;
  onSale: boolean;
  createdAt: string;
  tags?: string[];
}): UIProduct["badge"] {
  // Deliberate merchandising signals (staff marked it a bestseller via
  // is_featured or an explicit tag, it's discounted) take priority over the
  // generic recency heuristic below — otherwise a freshly-seeded catalogue,
  // where every product is "new" for its first 30 days, would show "New" on
  // every card and "Best Seller" / "Sale" would never surface at all.
  if (opts.isFeatured || hasTag(opts.tags, TAG_ALIASES.bestSeller))
    return "Best Seller";
  if (opts.onSale || hasTag(opts.tags, TAG_ALIASES.sale)) return "Sale";

  // "New" — either an explicit tag or the recency fallback.
  const created = new Date(opts.createdAt).getTime();
  const isRecent =
    Number.isFinite(created) &&
    Date.now() - created < 30 * 24 * 60 * 60 * 1000;
  if (isRecent || hasTag(opts.tags, TAG_ALIASES.new)) return "New";
  return null;
}

/** Map a lightweight product-list item to the UI `Product` card shape. */
export function mapListItem(p: ProductListItem): UIProduct {
  const onSale = Number(p.discount_percent) > 0;
  const image = mediaUrl(
    p.primary_image?.s3_key || p.thumbnail_key,
    PLACEHOLDER_IMAGE
  );
  const hoverImage = p.hover_image?.s3_key ? mediaUrl(p.hover_image.s3_key) : undefined;
  const isNew =
    Date.now() - new Date(p.created_at).getTime() <
    30 * 24 * 60 * 60 * 1000;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: subtitleFor(p.metal_type, p.purity),
    category: toCategorySlug(null, p.category_name),
    price: Number(p.effective_price ?? p.price),
    originalPrice: onSale ? Number(p.price) : null,
    sku: p.sku,
    images: [image],
    hoverImage,
    description: "",
    specifications: [],
    silverDetails: "",
    care: [],
    inStock: p.is_in_stock,
    isNew: isNew || hasTag(p.tags, TAG_ALIASES.new),
    isBestSeller: p.is_featured || hasTag(p.tags, TAG_ALIASES.bestSeller),
    rating: 0,
    reviewCount: 0,
    badge: derivedBadge({
      isFeatured: p.is_featured,
      onSale,
      createdAt: p.created_at,
      tags: p.tags,
    }),
    tags: p.tags ?? [],
    // The list API only tells us *whether* a product is sized, not per-size
    // stock — that arrives on the detail response (see mapDetail).
    hasSizes: p.has_sizes,
  };
}

function specsFromDetail(p: ProductDetail): ProductSpec[] {
  const specs: ProductSpec[] = [];
  if (p.metal_type)
    specs.push({ label: "Metal", value: METAL_LABELS[p.metal_type] ?? p.metal_type });
  if (p.purity) specs.push({ label: "Purity", value: p.purity });
  if (p.gross_weight != null)
    specs.push({ label: "Gross Weight", value: `${p.gross_weight} g` });
  if (p.net_weight != null)
    specs.push({ label: "Net Weight", value: `${p.net_weight} g` });
  (p.dimensions ?? []).forEach((d: ProductDimension) => {
    if (d.label && d.value) specs.push({ label: d.label, value: `${d.value} ${d.unit}` });
  });
  if (p.available_sizes)
    specs.push({
      label: "Sizes",
      value: `${p.available_sizes}${p.size_unit ? ` (${p.size_unit})` : ""}`,
    });
  (p.stone_details ?? []).forEach((s: StoneDetail) => {
    specs.push({
      label: `Stone · ${s.type}`,
      value: [s.weight, s.quality, s.count ? `×${s.count}` : ""]
        .filter(Boolean)
        .join(" · "),
    });
  });
  return specs;
}

/** Map the full product-detail shape to the UI `Product`. */
export function mapDetail(p: ProductDetail): UIProduct {
  const onSale = Number(p.discount_percent) > 0;
  const images = (p.media ?? [])
    .filter((m) => m.media_type === "image")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => mediaUrl(m.s3_key));
  const video = (p.media ?? []).find((m) => m.media_type === "video");
  const hover = (p.media ?? []).find((m) => m.is_hover && m.media_type === "image");
  const gallery = [
    ...(images.length ? images : [mediaUrl(p.thumbnail_key, PLACEHOLDER_IMAGE)]),
    BIS_CERTIFICATE_IMAGE,
  ];

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: subtitleFor(p.metal_type, p.purity),
    category: toCategorySlug(p.category?.slug, p.category?.name),
    price: Number(p.effective_price ?? p.price),
    originalPrice: onSale ? Number(p.price) : null,
    sku: p.sku,
    images: gallery,
    hoverImage: hover ? mediaUrl(hover.s3_key) : undefined,
    video360: video ? mediaUrl(video.s3_key) : undefined,
    description: p.description ?? "",
    specifications: specsFromDetail(p),
    silverDetails:
      p.metal_type === "silver"
        ? "Crafted from hallmarked 925 sterling silver — 92.5% pure silver with a durable finish. Nickel-free and hypoallergenic."
        : p.description ?? "",
    care: p.care_instruction
      ? p.care_instruction.split(/\r?\n/).map((s) => s.trim()).filter(Boolean)
      : [
          "Store in the provided anti-tarnish pouch when not being worn.",
          "Keep away from perfume, lotion and water to preserve the shine.",
          "Polish gently with a soft cloth to restore lustre.",
        ],
    inStock: p.is_in_stock,
    isNew:
      Date.now() - new Date(p.created_at).getTime() <
        30 * 24 * 60 * 60 * 1000 || hasTag(p.tags, TAG_ALIASES.new),
    isBestSeller: p.is_featured || hasTag(p.tags, TAG_ALIASES.bestSeller),
    rating: 0,
    reviewCount: 0,
    badge: derivedBadge({
      isFeatured: p.is_featured,
      onSale,
      createdAt: p.created_at,
      tags: p.tags,
    }),
    tags: p.tags ?? [],
    hasSizes: p.has_sizes,
    sizeUnit: p.size_unit || undefined,
    variantLabel: p.variant_label || undefined,
    sizes: p.has_sizes
      ? (p.size_stock ?? []).map((s) => ({
          size: s.size,
          qty: s.qty,
          inStock: s.is_in_stock,
          ...(s.effective_price != null
            ? {
                price: Number(s.effective_price),
                originalPrice:
                  s.price != null && Number(s.price) > Number(s.effective_price)
                    ? Number(s.price)
                    : null,
              }
            : {}),
        }))
      : undefined,
  };
}

/** Map an API category (with S3 image key) to the UI `Category`. */
export function mapCategory(c: ApiCategory): UICategory {
  return {
    slug: toCategorySlug(c.slug, c.name),
    name: c.name,
    tagline: c.description || "",
    image: mediaUrl(c.image_key),
  };
}
