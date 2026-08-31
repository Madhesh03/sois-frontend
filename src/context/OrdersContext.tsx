"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ShippingInfo } from "./CartContext";
import { useAuth } from "./AuthContext";
import { ordersApi, mediaUrl } from "@/lib/api";
import type { Order as ApiOrder, ApiOrderStatus } from "@/lib/api";

export type OrderStatus =
  | "placed"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface OrderEvent {
  status: OrderStatus;
  label: string;
  date: string | null;
  done: boolean;
}

export interface Order {
  id: string;
  /** Human-readable order code (e.g. "SOIS-2026-00042"). Only set for
   *  backend-created orders — falls back to `id` for local/legacy records. */
  orderNumber?: string;
  date: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  timeline: OrderEvent[];
}

interface OrdersContextType {
  orders: Order[];
  lastOrder: Order | null;
  /** Loading flag while fetching orders from the API. */
  loading: boolean;
  getOrder: (id: string) => Order | undefined;
  /** Reload orders from the backend (authenticated customers only). */
  refresh: () => Promise<void>;
  /**
   * Fetch the just-placed order by id (the real, backend-created order from
   * checkout/initiate — not a client-fabricated record) and set it as
   * `lastOrder` for the confirmation screen. Also folds it into `orders` so
   * it's there immediately, without waiting for the next `refresh()`.
   */
  loadOrder: (orderId: string) => Promise<Order | null>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const STATUS_FLOW: { status: OrderStatus; label: string }[] = [
  { status: "placed", label: "Order Placed" },
  { status: "confirmed", label: "Payment Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export function statusLabel(status: OrderStatus): string {
  if (status === "cancelled") return "Cancelled";
  return STATUS_FLOW.find((s) => s.status === status)?.label ?? status;
}

/** Map a backend order status onto the storefront's timeline status. */
function mapStatus(status: ApiOrderStatus): OrderStatus {
  switch (status) {
    case "pending":
      return "placed";
    case "paid":
      return "confirmed";
    case "processing":
      return "processing";
    case "shipped":
      return "shipped";
    case "delivered":
      return "delivered";
    case "cancelled":
    case "returned":
    case "refunded":
      return "cancelled";
    default:
      return "placed";
  }
}

function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

/** Build the ordered status timeline for a given current status. */
function buildTimeline(status: OrderStatus, orderDate: string): OrderEvent[] {
  const base = new Date(orderDate);
  if (status === "cancelled") {
    return [
      { status: "placed", label: "Order Placed", date: orderDate, done: true },
      {
        status: "cancelled",
        label: "Cancelled",
        date: addDays(base, 1),
        done: true,
      },
    ];
  }
  const currentIndex = STATUS_FLOW.findIndex((s) => s.status === status);
  return STATUS_FLOW.map((step, i) => ({
    status: step.status,
    label: step.label,
    date: i <= currentIndex ? addDays(base, i) : null,
    done: i <= currentIndex,
  }));
}

/** Map a backend order to the storefront's UI order shape. */
function mapApiOrder(o: ApiOrder): Order {
  const status = mapStatus(o.status);
  const addr = o.shipping_address;
  const shipping: ShippingInfo = {
    fullName: addr?.full_name ?? "",
    email: o.customer_email ?? "",
    phone: addr?.phone ?? "",
    address: [addr?.line1, addr?.line2].filter(Boolean).join(", "),
    city: addr?.city ?? "",
    state: addr?.state ?? "",
    pincode: addr?.pincode ?? "",
  };
  return {
    id: o.id,
    orderNumber: o.order_number,
    date: o.created_at,
    items: o.items.map((it) => ({
      id: it.product_id,
      name: it.product_name,
      price: Number(it.unit_price),
      image: mediaUrl(it.thumbnail_key),
      quantity: it.quantity,
      size: it.selected_size || undefined,
    })),
    shipping,
    paymentMethod:
      o.payment_status === "captured" ? "Online (Razorpay)" : "Razorpay",
    subtotal: Number(o.subtotal),
    shippingFee: Number(o.shipping_charge),
    total: Number(o.total_amount),
    status,
    timeline: buildTimeline(status, o.created_at),
  };
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    if (!isAuthenticated) {
      setOrders([]);
      return;
    }
    setLoading(true);
    try {
      const apiOrders = await ordersApi.listOrders();
      setOrders(apiOrders.map(mapApiOrder));
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Load order history from the backend whenever auth state changes.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!isAuthenticated) {
        if (active) setOrders([]);
        return;
      }
      setLoading(true);
      try {
        const apiOrders = await ordersApi.listOrders();
        if (active) setOrders(apiOrders.map(mapApiOrder));
      } catch {
        if (active) setOrders([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  const loadOrder = async (orderId: string): Promise<Order | null> => {
    try {
      const order = mapApiOrder(await ordersApi.getOrder(orderId));
      setLastOrder(order);
      setOrders((prev) => [order, ...prev.filter((o) => o.id !== order.id)]);
      return order;
    } catch {
      return null;
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        lastOrder,
        loading,
        getOrder,
        refresh,
        loadOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
