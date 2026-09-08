/**
 * Barrel for the SOIS consumer-API client. Import endpoint groups as
 * namespaces to keep call-sites readable, e.g.:
 *
 *   import { catalogApi, cartApi } from "@/lib/api";
 *   const cart = await cartApi.getCart();
 */
export * as authApi from "./auth";
export * as catalogApi from "./catalog";
export * as cartApi from "./cart";
export * as addressApi from "./addresses";
export * as checkoutApi from "./checkout";
export * as ordersApi from "./orders";
export * as returnsApi from "./returns";
export * as wishlistApi from "./wishlist";
export * as paymentsApi from "./payments";
export * as shippingApi from "./shipping";

export { ApiError, API_BASE_URL } from "./client";
export {
  getSessionKey,
  peekSessionKey,
  isAuthenticated,
  setTokens,
} from "./session";
export { mediaUrl, PLACEHOLDER_IMAGE } from "./media";
export * from "./mappers";
export type * from "./types";
