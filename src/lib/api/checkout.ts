/** Checkout endpoints (`/orders/checkout/*`). Auth required. */
import { apiPost } from "./client";
import type {
  CheckoutAddressInput,
  CheckoutInitiateResult,
  CheckoutPreview,
} from "./types";

/**
 * Preview checkout totals — validates stock and computes totals without
 * creating an order or touching stock. Render the order summary from this.
 */
export function previewCheckout(
  input: CheckoutAddressInput
): Promise<CheckoutPreview> {
  return apiPost<CheckoutPreview>("/orders/checkout/preview/", input);
}

/**
 * Place the order and create a Razorpay payment order. The result carries
 * everything needed to open the Razorpay Checkout widget client-side. Final
 * `paid` status arrives asynchronously via webhook — poll the order/payment
 * endpoints after the widget closes.
 */
export function initiateCheckout(
  input: CheckoutAddressInput
): Promise<CheckoutInitiateResult> {
  return apiPost<CheckoutInitiateResult>("/orders/checkout/initiate/", input);
}
