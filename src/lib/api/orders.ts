/** Customer order endpoints (`/orders/*`). Auth required. */
import { apiGet, apiPost } from "./client";
import type { InvoiceLinks, Order } from "./types";

export function listOrders(): Promise<Order[]> {
  return apiGet<Order[]>("/orders/");
}

export function getOrder(id: string): Promise<Order> {
  return apiGet<Order>(`/orders/${id}/`);
}

/** Cancel an order (only while `pending` or `paid`). */
export function cancelOrder(id: string, reason?: string): Promise<Order> {
  return apiPost<Order>(`/orders/${id}/cancel/`, reason ? { reason } : {});
}

/** Get presigned links to the order's GST tax invoice PDF. Available once the
 *  order is paid; 404s (thrown as ApiError) while it's still pending. */
export function getInvoice(id: string): Promise<InvoiceLinks> {
  return apiGet<InvoiceLinks>(`/orders/${id}/invoice/`);
}
