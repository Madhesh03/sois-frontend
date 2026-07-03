"use client";

import Link from "next/link";
import { Package } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useOrders } from "@/context/OrdersContext";
import { formatOrderDate, StatusBadge } from "@/components/account/orderView";
import { formatPrice } from "@/lib/catalog";

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
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="sois-order-row"
            >
              <div className="sois-order-row-thumbs">
                {order.items.slice(0, 3).map((it) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={it.id} src={it.image} alt={it.name} />
                ))}
              </div>
              <div className="sois-order-row-main">
                <div className="sois-order-row-id">{order.id}</div>
                <div className="sois-order-row-meta">
                  {formatOrderDate(order.date)} ·{" "}
                  {order.items.reduce((n, i) => n + i.quantity, 0)} items
                </div>
              </div>
              <div className="sois-order-row-right">
                <StatusBadge status={order.status} />
                <span className="sois-order-row-total">
                  {formatPrice(order.total)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AccountShell>
  );
}
