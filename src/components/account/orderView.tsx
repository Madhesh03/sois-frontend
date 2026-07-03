"use client";

import { Check } from "lucide-react";
import { Order, OrderStatus, statusLabel } from "@/context/OrdersContext";

export function formatOrderDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const BADGE_STYLES: Record<OrderStatus, { bg: string; color: string }> = {
  placed: { bg: "#F3F4F6", color: "#115E59" },
  confirmed: { bg: "#F3F4F6", color: "#115E59" },
  processing: { bg: "#FEF3C7", color: "#92400E" },
  shipped: { bg: "#E0F2FE", color: "#075985" },
  delivered: { bg: "#D1FAE5", color: "#065F46" },
  cancelled: { bg: "#FEE2E2", color: "#B91C1C" },
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = BADGE_STYLES[status];
  return (
    <span
      className="sois-status-badge"
      style={{ background: s.bg, color: s.color }}
    >
      {statusLabel(status)}
    </span>
  );
}

export function OrderTimeline({ order }: { order: Order }) {
  return (
    <ol className="sois-timeline">
      {order.timeline.map((ev, i) => {
        const isLast = i === order.timeline.length - 1;
        const cancelled = ev.status === "cancelled";
        return (
          <li
            key={ev.status}
            className={`sois-timeline-step${ev.done ? " done" : ""}${
              cancelled ? " cancelled" : ""
            }`}
          >
            <span className="sois-timeline-marker">
              {ev.done && !cancelled && <Check size={12} />}
              {cancelled && "✕"}
            </span>
            {!isLast && <span className="sois-timeline-line" />}
            <div className="sois-timeline-body">
              <span className="sois-timeline-label">{ev.label}</span>
              <span className="sois-timeline-date">
                {ev.date ? formatOrderDate(ev.date) : "Pending"}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
