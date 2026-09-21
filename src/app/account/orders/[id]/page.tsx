"use client";

import { use, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Truck, Package, ExternalLink, Star } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { useOrders } from "@/context/OrdersContext";
import {
  formatOrderDate,
  StatusBadge,
  OrderTimeline,
} from "@/components/account/orderView";
import { formatPrice } from "@/lib/catalog";
import { shippingApi } from "@/lib/api";
import type { TrackingInfo } from "@/lib/api";
import { ReviewForm } from "@/components/reviews/ReviewForm";

export default function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = use(params);
  const sp = use(searchParams);
  const { getOrder, loadOrder, loading } = useOrders();
  const order = getOrder(id);
  const itemsPanelRef = useRef<HTMLDivElement>(null);

  // Cold landing from an email CTA (/account/orders/<id>): the orders list may
  // not be in context yet, so fetch this one directly by id. Without this the
  // page flashes "Order not found" for a real order until the list loads.
  const [fetching, setFetching] = useState(false);
  useEffect(() => {
    if (order || loading || fetching) return;
    setFetching(true);
    loadOrder(id).finally(() => setFetching(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, order, loading]);

  // Real carrier tracking (courier, AWB, live events) — separate from
  // `order.timeline`, which is a coarse status stepper derived from the
  // order's own status. This is empty for most orders: a shipment only
  // exists once staff books one in the Admin portal, so a 404 here is the
  // normal, expected state for a freshly-placed order, not an error.
  const [tracking, setTracking] = useState<TrackingInfo | null>(null);

  useEffect(() => {
    if (!order) return;
    let active = true;
    shippingApi
      .trackOrder(order.id)
      .then((t) => {
        if (active) setTracking(t);
      })
      .catch(() => {
        if (active) setTracking(null);
      });
    return () => {
      active = false;
    };
  }, [order]);

  // Which order item currently has its inline review form open, keyed by
  // the real order-item id (not the product id).
  const [openReviewFor, setOpenReviewFor] = useState<string | null>(null);
  // Order items reviewed during this session. The order in context isn't
  // refetched after a successful submit, so this tracks the change locally
  // (keyed by orderItemId) until the next `refresh()`/`loadOrder()`.
  const [justReviewed, setJustReviewed] = useState<Set<string>>(new Set());

  // Arriving from the review-request email (?review=1): scroll the items
  // panel into view and, if there's exactly one item left to review, open
  // its form directly.
  useEffect(() => {
    if (!order || sp.review !== "1") return;
    itemsPanelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    const reviewable = order.items.filter(
      (it) => !it.isReviewed && !justReviewed.has(it.orderItemId)
    );
    if (reviewable.length === 1) setOpenReviewFor(reviewable[0].orderItemId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, sp]);

  return (
    <AccountShell title="Order Details">
      {!order && (loading || fetching) ? (
        <div className="sois-account-empty-state">
          <Package size={30} />
          <p className="sois-empty-title">Loading order…</p>
        </div>
      ) : !order ? (
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
            {tracking && (
              <>
                <div className="sois-order-tracking-meta">
                  <Truck size={16} />
                  <span>
                    {tracking.courier} · <strong>{tracking.awb}</strong>
                  </span>
                  {tracking.estimated_delivery && !tracking.delivered_at && (
                    <span className="sois-order-eta">
                      Est. delivery {formatOrderDate(tracking.estimated_delivery)}
                    </span>
                  )}
                  {tracking.tracking_url && (
                    <a
                      href={tracking.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sois-order-tracking-link"
                    >
                      Track with courier <ExternalLink size={12} />
                    </a>
                  )}
                </div>
                {tracking.events.length > 0 && (
                  <ul className="sois-order-tracking-events">
                    {tracking.events.map((ev, i) => (
                      <li key={i}>
                        <span className="sois-order-tracking-event-status">
                          {ev.status}
                        </span>
                        {ev.description && <span> — {ev.description}</span>}
                        {ev.location && (
                          <span className="sois-order-tracking-event-loc">
                            {" "}
                            · {ev.location}
                          </span>
                        )}
                        <span className="sois-order-tracking-event-time">
                          {formatOrderDate(ev.timestamp)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            <OrderTimeline order={order} />
          </div>

          {/* Items */}
          <div className="sois-order-panel" ref={itemsPanelRef}>
            <h3 className="sois-order-panel-title">
              Items ({order.items.reduce((n, i) => n + i.quantity, 0)})
            </h3>
            <div className="sois-order-items">
              {order.items.map((it) => {
                const reviewed =
                  it.isReviewed || justReviewed.has(it.orderItemId);
                const canReview = order.status === "delivered" && !reviewed;
                const formOpen = openReviewFor === it.orderItemId;
                return (
                  <div key={it.orderItemId} className="sois-order-item-block">
                    <div className="sois-order-item">
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

                    {reviewed && (
                      <span className="sois-order-item-reviewed">
                        <Star size={13} fill="#115E59" color="#115E59" />{" "}
                        Reviewed
                      </span>
                    )}

                    {canReview && !formOpen && (
                      <button
                        type="button"
                        className="sois-order-item-review-btn"
                        onClick={() => setOpenReviewFor(it.orderItemId)}
                      >
                        <Star size={13} /> Write a review
                      </button>
                    )}

                    {canReview && formOpen && (
                      <ReviewForm
                        productId={it.id}
                        orderItemId={it.orderItemId}
                        onCancel={() => setOpenReviewFor(null)}
                        onDone={() => {
                          setJustReviewed((prev) => {
                            const next = new Set(prev);
                            next.add(it.orderItemId);
                            return next;
                          });
                        }}
                      />
                    )}
                  </div>
                );
              })}
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
