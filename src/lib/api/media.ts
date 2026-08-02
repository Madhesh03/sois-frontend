/**
 * Product/category media in the backend is stored as S3 object *keys*
 * (`thumbnail_key`, `image_key`, `ProductMedia.s3_key`, …). The frontend joins
 * a key onto `NEXT_PUBLIC_MEDIA_BASE_URL` to get a renderable URL.
 *
 * If the media base URL isn't configured (e.g. local dev without S3), or a key
 * is already a full URL, we fall back gracefully so the UI still renders.
 */
const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL || "").replace(
  /\/$/,
  ""
);

/** A neutral placeholder used when a product has no media configured. */
export const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1616294208582-c2a6d73b467b?w=600&h=720&fit=crop&auto=format&q=85";

/**
 * Resolve an S3 key (or an already-absolute URL) to a renderable image URL.
 * Returns `fallback` when the key is empty.
 */
export function mediaUrl(
  key: string | null | undefined,
  fallback: string = PLACEHOLDER_IMAGE
): string {
  if (!key) return fallback;
  if (/^https?:\/\//i.test(key)) return key;
  if (!MEDIA_BASE) return fallback;
  return `${MEDIA_BASE}/${key.replace(/^\//, "")}`;
}
