"use client";

import { use } from "react";
import Link from "next/link";
import { Truck, Package } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useOrders } from "@/context/OrdersContext";
import {
  formatOrderDate,
  StatusBadge,
  OrderTimeline,
} from "@/components/account/orderView";
import { formatPrice } from "@/lib/catalog";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getOrder } = useOrders();
  const order = getOrder(id);

  return (
    <AccountShell title="Order Details">
      {!order ? (
        <div className="sois-account-empty-state">
          <Package size={30} />
          <p className="sois-empty-title">Order not found</p>
          <p className="sois-empty-sub">
            We couldn&apos;t find an order with that reference.
          </p>
          <Link href="/account/orders" className="sois-account-cta">
            Back to Orders
          </Link>
        </div>
      ) : (
        <div className="sois-order-detail">
          <div className="sois-order-detail-head">
            <div>
              <div className="sois-order-detail-id">{order.id}</div>
              <div className="sois-order-detail-date">
                Placed on {formatOrderDate(order.date)}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Tracking */}
          <div className="sois-order-panel">
            <h3 className="sois-order-panel-title">Order Tracking</h3>
            {order.trackingNumber && (
              <div className="sois-order-tracking-meta">
                <Truck size={16} />
                <span>
                  {order.courier} · <strong>{order.trackingNumber}</strong>
                </span>
                {order.estimatedDelivery && order.status !== "delivered" && (
                  <span className="sois-order-eta">
                    Est. delivery {formatOrderDate(order.estimatedDelivery)}
                  </span>
                )}
              </div>
            )}
            <OrderTimeline order={order} />
          </div>

          {/* Items */}
          <div className="sois-order-panel">
            <h3 className="sois-order-panel-title">
              Items ({order.items.reduce((n, i) => n + i.quantity, 0)})
            </h3>
            <div className="sois-order-items">
              {order.items.map((it) => (
                <div key={it.id} className="sois-order-item">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={it.image} alt={it.name} />
                  <div className="sois-order-item-main">
                    <span className="sois-order-item-name">{it.name}</span>
                    <span className="sois-order-item-qty">
                      Qty {it.quantity}
                    </span>
                  </div>
                  <span className="sois-order-item-price">
                    {formatPrice(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="sois-order-detail-grid">
            {/* Address */}
            <div className="sois-order-panel">
              <h3 className="sois-order-panel-title">Delivery Address</h3>
              <div className="sois-order-address">
                <strong>{order.shipping.fullName}</strong>
                <br />
                {order.shipping.address}, {order.shipping.city},{" "}
                {order.shipping.state} - {order.shipping.pincode}
                <br />
                {order.shipping.phone}
              </div>
            </div>

            {/* Summary */}
            <div className="sois-order-panel">
              <h3 className="sois-order-panel-title">Payment Summary</h3>
              <div className="sois-order-summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="sois-order-summary-row">
                <span>Shipping</span>
                <span>
                  {order.shippingFee === 0
                    ? "Free"
                    : formatPrice(order.shippingFee)}
                </span>
              </div>
              <div className="sois-order-summary-row total">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
              <div className="sois-order-summary-pay">
                Paid via {order.paymentMethod}
              </div>
            </div>
          </div>
        </div>
      )}
    </AccountShell>
  );
}
