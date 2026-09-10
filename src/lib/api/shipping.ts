/** Shipment tracking + serviceability endpoints. Auth required. */
import { apiGet } from "./client";
import type { PincodeServiceability, TrackingInfo } from "./types";

export function trackOrder(orderId: string): Promise<TrackingInfo> {
  return apiGet<TrackingInfo>(`/shipping/track/${orderId}/`);
}

/** Is this pincode serviceable from our pickup location? Call before saving an address. */
export function checkPincode(pincode: string): Promise<PincodeServiceability> {
  return apiGet<PincodeServiceability>("/shipping/check-pincode/", {
    params: { pincode },
  });
}
