"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ShippingInfo } from "./CartContext";
import { getAllProducts } from "@/lib/catalog";

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
  date: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  status: OrderStatus;
  timeline: OrderEvent[];
  trackingNumber?: string;
  courier?: string;
  estimatedDelivery?: string;
}

export interface CreateOrderInput {
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
}

interface OrdersContextType {
  orders: Order[];
  lastOrder: Order | null;
  createOrder: (input: CreateOrderInput) => Order;
  getOrder: (id: string) => Order | undefined;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const ORDERS_KEY = "sois_orders";

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

function genOrderId(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SOIS-${rand}`;
}

function loadOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function persistOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {
    /* ignore */
  }
}

const DEMO_SHIPPING: ShippingInfo = {
  fullName: "Aarav Sharma",
  email: "aarav@example.com",
  phone: "75400 08075",
  address: "12 Radhakrishnan Salai, Mylapore",
  city: "Chennai",
  state: "Tamil Nadu",
  pincode: "600004",
};

/** Seed a couple of illustrative past orders so history/tracking is populated. */
function seedOrders(): Order[] {
  const all = getAllProducts();
  const pick = (slug: string) => all.find((p) => p.slug === slug) ?? all[0];
  const now = new Date();

  const toItem = (slug: string, quantity: number): OrderItem => {
    const p = pick(slug);
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.images[0],
      quantity,
    };
  };

  const order1Date = addDays(now, -22);
  const o1Items = [toItem("crescent-moon-pendant", 1), toItem("petite-orbit-studs", 1)];
  const o1Subtotal = o1Items.reduce((s, i) => s + i.price * i.quantity, 0);

  const order2Date = addDays(now, -3);
  const o2Items = [toItem("eterna-cuff-bracelet", 1)];
  const o2Subtotal = o2Items.reduce((s, i) => s + i.price * i.quantity, 0);

  return [
    {
      id: "SOIS-7QX4KD",
      date: order2Date,
      items: o2Items,
      shipping: DEMO_SHIPPING,
      paymentMethod: "UPI",
      subtotal: o2Subtotal,
      shippingFee: 0,
      total: o2Subtotal,
      status: "shipped",
      timeline: buildTimeline("shipped", order2Date),
      trackingNumber: "SOISIN284519037",
      courier: "BlueDart",
      estimatedDelivery: addDays(new Date(order2Date), 5),
    },
    {
      id: "SOIS-3MB9PL",
      date: order1Date,
      items: o1Items,
      shipping: DEMO_SHIPPING,
      paymentMethod: "Credit Card",
      subtotal: o1Subtotal,
      shippingFee: 0,
      total: o1Subtotal,
      status: "delivered",
      timeline: buildTimeline("delivered", order1Date),
      trackingNumber: "SOISIN193847265",
      courier: "Delhivery",
    },
  ];
}

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  // Hydrate on mount; seed demo history the first time.
  useEffect(() => {
    const stored = loadOrders();
    if (stored.length) {
      setOrders(stored);
    } else {
      const seeded = seedOrders();
      setOrders(seeded);
      persistOrders(seeded);
    }
  }, []);

  const createOrder = (input: CreateOrderInput): Order => {
    const date = new Date().toISOString();
    const order: Order = {
      id: genOrderId(),
      date,
      items: input.items,
      shipping: input.shipping,
      paymentMethod: input.paymentMethod,
      subtotal: input.subtotal,
      shippingFee: input.shippingFee,
      total: input.total,
      status: "confirmed",
      timeline: buildTimeline("confirmed", date),
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      persistOrders(next);
      return next;
    });
    setLastOrder(order);
    return order;
  };

  const getOrder = (id: string) => orders.find((o) => o.id === id);

  return (
    <OrdersContext.Provider
      value={{ orders, lastOrder, createOrder, getOrder }}
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
