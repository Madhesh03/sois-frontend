/** Customer order endpoints (`/orders/*`). Auth required. */
import { apiGet, apiPost } from "./client";
import type { Order } from "./types";

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
