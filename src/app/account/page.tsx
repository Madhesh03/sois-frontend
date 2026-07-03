"use client";

import Link from "next/link";
import { Package, MapPin, ChevronRight, ShoppingBag } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useOrders } from "@/context/OrdersContext";
import { useCart } from "@/context/CartContext";
import { formatOrderDate, StatusBadge } from "@/components/account/orderView";
import { formatPrice } from "@/lib/catalog";

export default function AccountOverviewPage() {
  const { orders } = useOrders();
  const { savedAddresses } = useCart();
  const recent = orders.slice(0, 3);

  return (
    <AccountShell title="Overview">
      {/* Quick stats */}
      <div className="sois-acct-stats">
        <Link href="/account/orders" className="sois-acct-stat">
          <span className="sois-acct-stat-icon">
            <Package size={20} />
          </span>
          <span className="sois-acct-stat-text">
            <span className="sois-acct-stat-num">{orders.length}</span>
            <span className="sois-acct-stat-label">Total Orders</span>
          </span>
          <ChevronRight size={18} className="sois-acct-stat-arrow" />
        </Link>
        <Link href="/account/addresses" className="sois-acct-stat">
          <span className="sois-acct-stat-icon">
            <MapPin size={20} />
          </span>
          <span className="sois-acct-stat-text">
            <span className="sois-acct-stat-num">{savedAddresses.length}</span>
            <span className="sois-acct-stat-label">Saved Addresses</span>
          </span>
          <ChevronRight size={18} className="sois-acct-stat-arrow" />
        </Link>
      </div>

      {/* Recent orders */}
      <div className="sois-acct-block">
        <div className="sois-acct-block-head">
          <h2>Recent Orders</h2>
          {orders.length > 0 && (
            <Link href="/account/orders" className="sois-acct-viewall">
              View all <ChevronRight size={14} />
            </Link>
          )}
        </div>

        {recent.length === 0 ? (
          <div className="sois-acct-empty">
            <ShoppingBag size={28} />
            <p className="sois-empty-title">No orders yet</p>
            <p className="sois-empty-sub">
              When you place an order it will show up here.
            </p>
            <Link href="/shop" className="sois-account-cta">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="sois-order-list">
            {recent.map((order) => (
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
      </div>
    </AccountShell>
  );
}
