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
import type {
  ApiCategory,
  ProductDetail,
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
  const candidate = (slug || name || "").toLowerCase();
  const hit = KNOWN_SLUGS.find(
    (s) => candidate === s || candidate.includes(s) || `${s}s` === candidate
  );
  return hit ?? "gifts";
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

function derivedBadge(opts: {
  isFeatured: boolean;
  onSale: boolean;
  createdAt: string;
}): UIProduct["badge"] {
  // "New" if created within the last 30 days.
  const created = new Date(opts.createdAt).getTime();
  const isNew =
    Number.isFinite(created) &&
    Date.now() - created < 30 * 24 * 60 * 60 * 1000;
  if (isNew) return "New";
  if (opts.isFeatured) return "Best Seller";
  if (opts.onSale) return "Sale";
  return null;
}

/** Map a lightweight product-list item to the UI `Product` card shape. */
export function mapListItem(p: ProductListItem): UIProduct {
  const onSale = Number(p.discount_percent) > 0;
  const image = mediaUrl(
    p.primary_image?.s3_key || p.thumbnail_key,
    PLACEHOLDER_IMAGE
  );
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
    description: "",
    specifications: [],
    silverDetails: "",
    care: [],
    inStock: p.is_in_stock,
    isNew,
    isBestSeller: p.is_featured,
    rating: 0,
    reviewCount: 0,
    badge: derivedBadge({
      isFeatured: p.is_featured,
      onSale,
      createdAt: p.created_at,
    }),
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
  if (p.sku) specs.push({ label: "SKU", value: p.sku });
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
  const gallery = images.length
    ? images
    : [mediaUrl(p.thumbnail_key, PLACEHOLDER_IMAGE)];

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
    video360: video ? mediaUrl(video.s3_key) : undefined,
    description: p.description ?? "",
    specifications: specsFromDetail(p),
    silverDetails:
      p.metal_type === "silver"
        ? "Crafted from hallmarked 925 sterling silver — 92.5% pure silver with a durable, tarnish-resistant finish. Nickel-free and hypoallergenic."
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
      30 * 24 * 60 * 60 * 1000,
    isBestSeller: p.is_featured,
    rating: 0,
    reviewCount: 0,
    badge: derivedBadge({
      isFeatured: p.is_featured,
      onSale,
      createdAt: p.created_at,
    }),
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
