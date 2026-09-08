/** Payment endpoints (`/payments/*`). Auth required. */
import { apiGet, apiPost } from "./client";
import type { Payment } from "./types";

/**
 * (Rarely used) re-create a Razorpay order for a pending order — e.g. the
 * widget was closed without completing payment. Normal payment initiation
 * happens inside `/orders/checkout/initiate/`.
 */
export function initiatePayment(
  orderId: string
): Promise<Record<string, unknown>> {
  return apiPost<Record<string, unknown>>("/payments/initiate/", {
    order_id: orderId,
  });
}

/** Poll payment status after the Razorpay widget closes. */
export function getPaymentStatus(orderId: string): Promise<Payment> {
  return apiGet<Payment>(`/payments/orders/${orderId}/`);
}
