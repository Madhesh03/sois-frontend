"use client";

import { useEffect, useRef, useState } from "react";
import { shippingApi, ApiError } from "@/lib/api";

export type PincodeCheckStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "serviceable"; days: number | null }
  | { state: "unserviceable" }
  | { state: "error"; message: string };

const PINCODE_RE = /^\d{6}$/;

/**
 * Debounced serviceability check for a pincode as the customer types it.
 * Cancels a stale in-flight check if the pincode changes again before it
 * resolves, so a slow first request can't overwrite the result of a later one.
 */
export function usePincodeCheck(pincode: string): PincodeCheckStatus {
  const [status, setStatus] = useState<PincodeCheckStatus>({ state: "idle" });
  const requestId = useRef(0);

  useEffect(() => {
    if (!PINCODE_RE.test(pincode)) {
      setStatus({ state: "idle" });
      return;
    }
    const id = ++requestId.current;
    setStatus({ state: "checking" });

    const timer = setTimeout(() => {
      shippingApi
        .checkPincode(pincode)
        .then((res) => {
          if (id !== requestId.current) return;
          setStatus(
            res.serviceable
              ? { state: "serviceable", days: res.estimated_delivery_days }
              : { state: "unserviceable" },
          );
        })
        .catch((err) => {
          if (id !== requestId.current) return;
          setStatus({
            state: "error",
            message:
              err instanceof ApiError
                ? err.firstMessage
                : "Could not check delivery availability.",
          });
        });
    }, 500);

    return () => clearTimeout(timer);
  }, [pincode]);

  return status;
}
