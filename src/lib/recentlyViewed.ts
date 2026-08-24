/**
 * Recently-viewed products — stored client-side (localStorage), most-recent
 * first. We intentionally keep only product IDs here, not full snapshots: the
 * strip is hydrated with fresh data via the batch endpoint
 * (`getProductsByIds`), so prices/stock never go stale and no server-side
 * per-user tracking table is needed. Works the same for guests and logged-in
 * customers.
 */

const STORAGE_KEY = "sois:recently-viewed";
const MAX_ENTRIES = 12;

/** True only in the browser — guards SSR where `localStorage` is undefined. */
function hasStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

/** The stored IDs, most-recent first. Empty on SSR or when unset/corrupt. */
export function getRecentlyViewedIds(): string[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Record a viewed product. Moves an existing ID to the front (dedupe) and caps
 * the list at `MAX_ENTRIES`. No-op on SSR or with an empty id.
 */
export function recordRecentlyViewed(id: string): void {
  if (!hasStorage() || !id) return;
  try {
    const next = [id, ...getRecentlyViewedIds().filter((x) => x !== id)].slice(
      0,
      MAX_ENTRIES
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage full / disabled — recently-viewed is best-effort, so ignore.
  }
}

/** Clear the history (e.g. from a privacy control). */
export function clearRecentlyViewed(): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
