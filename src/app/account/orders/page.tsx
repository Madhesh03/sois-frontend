"use client";

import Link from "next/link";
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  Clock,
  Package,
  Truck,
} from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useOrders, statusLabel, type Order } from "@/context/OrdersContext";
import { ItemReviewPanel } from "@/components/reviews/ItemReviewPanel";
import { formatPrice } from "@/lib/catalog";

function formatDayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

const STATUS_ICON = {
  placed: Clock,
  confirmed: Package,
  processing: Package,
  shipped: Truck,
  delivered: CircleCheck,
  cancelled: CircleX,
} as const;

/** Header line under the status: delivered/cancelled show when it happened,
 *  everything else shows when the order was placed. */
function statusSubtitle(order: Order): string {
  if (order.status === "delivered" || order.status === "cancelled") {
    return `On ${formatDayDate(order.updatedAt)}`;
  }
  return `Ordered on ${formatDayDate(order.date)}`;
}

export default function OrdersPage() {
  const { orders } = useOrders();

  return (
    <AccountShell title="My Orders">
      {orders.length === 0 ? (
        <div className="sois-account-empty-state">
          <Package size={30} />
          <p className="sois-empty-title">No orders yet</p>
          <p className="sois-empty-sub">
            When you place an order it will appear here.
          </p>
          <Link href="/shop" className="sois-account-cta">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="sois-order-list">
          {orders.map((order) => {
            const Icon = STATUS_ICON[order.status];
            const href = `/account/orders/${order.id}`;
            return (
              <section
                key={order.id}
                className={`sois-order-card is-${order.status}`}
              >
                <header className="sois-order-card-head">
                  <span className="sois-order-card-icon">
                    <Icon size={20} />
                  </span>
                  <div className="sois-order-card-status">
                    <span className="sois-order-card-status-label">
                      {statusLabel(order.status)}
                    </span>
                    <span className="sois-order-card-status-sub">
                      {statusSubtitle(order)}
                    </span>
                  </div>
                  <div className="sois-order-card-meta">
                    <span>#{order.orderNumber ?? order.id.slice(0, 8)}</span>
                    <strong>{formatPrice(order.total)}</strong>
                  </div>
                </header>

                {order.items.map((it) => (
                  <div key={it.orderItemId} className="sois-order-card-item">
                    <Link href={href} className="sois-order-card-product">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={it.image} alt={it.name} />
                      <div className="sois-order-card-product-main">
                        <span className="sois-order-card-product-name">
                          {it.name}
                        </span>
                        <span className="sois-order-card-product-meta">
                          {[
                            it.size && `Size: ${it.size}`,
                            `Qty: ${it.quantity}`,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </span>
                      </div>
                      <ChevronRight size={20} className="sois-order-card-chevron" />
                    </Link>
                    {order.status === "delivered" && (
                      <ItemReviewPanel item={it} />
                    )}
                  </div>
                ))}
              </section>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}
