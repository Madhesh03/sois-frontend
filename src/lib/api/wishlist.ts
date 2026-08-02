/** Customer wishlist endpoints (`/orders/wishlist/`). Auth required. */
import { apiDelete, apiGet, apiPost } from "./client";
import type { WishlistItem } from "./types";

export function listWishlist(): Promise<WishlistItem[]> {
  return apiGet<WishlistItem[]>("/orders/wishlist/");
}

export function addToWishlist(productId: string): Promise<WishlistItem> {
  return apiPost<WishlistItem>("/orders/wishlist/", { product_id: productId });
}

export function removeFromWishlist(
  productId: string
): Promise<{ success: boolean; message: string }> {
  return apiDelete("/orders/wishlist/", { product_id: productId });
}
