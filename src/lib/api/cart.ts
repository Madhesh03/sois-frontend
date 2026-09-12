/**
 * Cart endpoints (`/orders/cart/*`). Works for both guests (via the
 * `X-Session-Key` header, attached automatically by the client) and
 * authenticated customers (matched by JWT).
 */
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { Cart } from "./types";

const opts = { useSessionKey: true } as const;

export function getCart(): Promise<Cart> {
  return apiGet<Cart>("/orders/cart/", opts);
}

export function addItem(input: {
  product_id: string;
  quantity?: number;
  selected_size?: string;
}): Promise<Cart> {
  return apiPost<Cart>("/orders/cart/", input, opts);
}

/**
 * Update a cart item's quantity. Setting quantity to 0 removes it — in that
 * case the backend returns a message rather than a cart, so callers should
 * re-fetch the cart via `getCart()`.
 */
export function updateItem(
  itemId: string,
  quantity: number
): Promise<Cart | { success: boolean; message: string }> {
  return apiPatch(`/orders/cart/items/${itemId}/`, { quantity }, opts);
}

export function removeItem(
  itemId: string
): Promise<{ success: boolean; message: string }> {
  return apiDelete(`/orders/cart/items/${itemId}/`, undefined, opts);
}

export function clearCart(): Promise<{ success: boolean; message: string }> {
  return apiDelete("/orders/cart/", undefined, opts);
}

/** Merge a guest cart into the authenticated customer's cart after login. */
export function mergeCart(sessionKey: string): Promise<Cart> {
  return apiPost<Cart>("/orders/cart/merge/", { session_key: sessionKey });
}

/**
 * Choose the gift hamper that packs the cart, or clear it by passing null. The
 * box count is derived server-side from the piece count and returned on the
 * cart's `gift_hamper` field.
 */
export function setGiftHamper(productId: string | null): Promise<Cart> {
  return apiPost<Cart>(
    "/orders/cart/gift-hamper/",
    { product_id: productId },
    opts
  );
}
