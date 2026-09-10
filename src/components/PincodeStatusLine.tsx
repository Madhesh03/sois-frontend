"use client";

import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import type { PincodeCheckStatus } from "@/hooks/usePincodeCheck";

/** Small inline status line shown under a pincode field as it's checked. */
export function PincodeStatusLine({ status }: { status: PincodeCheckStatus }) {
  const base = {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontSize: "0.75rem",
    marginTop: 5,
  } as const;

  if (status.state === "checking") {
    return (
      <span style={{ ...base, color: "#8a8a8a" }}>
        <Loader2 size={13} className="sois-spin" />
        Checking delivery availability…
      </span>
    );
  }
  if (status.state === "serviceable") {
    return (
      <span style={{ ...base, color: "#1e7e34" }}>
        <CircleCheck size={13} />
        Delivery available
        {status.days != null ? ` — est. ${status.days} day${status.days === 1 ? "" : "s"}` : ""}
      </span>
    );
  }
  if (status.state === "unserviceable") {
    return (
      <span style={{ ...base, color: "#d4183d" }}>
        <CircleAlert size={13} />
        Sorry, we don&apos;t deliver to this pincode yet.
      </span>
    );
  }
  if (status.state === "error") {
    return (
      <span style={{ ...base, color: "#8a8a8a" }}>
        <CircleAlert size={13} />
        {status.message}
      </span>
    );
  }
  return null;
}
