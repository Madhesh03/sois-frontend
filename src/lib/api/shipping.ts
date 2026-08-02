/** Shipment tracking endpoint (`/shipping/track/{order_id}/`). Auth required. */
import { apiGet } from "./client";
import type { TrackingInfo } from "./types";

export function trackOrder(orderId: string): Promise<TrackingInfo> {
  return apiGet<TrackingInfo>(`/shipping/track/${orderId}/`);
}
