"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart, ShippingInfo } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { T } from "@/lib/tokens";
import { checkoutApi, ApiError } from "@/lib/api";
import { openRazorpayCheckout } from "@/lib/razorpay";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ChevronLeft,
  MapPin,
  Check,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  ShieldCheck,
} from "lucide-react";

// Resolve a product's detail-page path from its name (slugified — the product
// page resolves the live product by slug).
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
function productHref(name: string): string {
  return `/product/${slugify(name)}`;
}

function ShippingForm() {
  const {
    setCheckoutStep,
    setShippingInfo,
    saveAddress,
    shippingInfo,
    savedAddresses,
  } = useCart();
  const { user } = useAuth();

  // Only real, previously-saved addresses are offered here — no fabricated
  // "sample" entry. A signed-in customer with none yet simply lands straight
  // on the entry form.
  const displayAddresses: ShippingInfo[] = savedAddresses;

  const [mode, setMode] = useState<"select" | "form">(
    displayAddresses.length > 0 ? "select" : "form"
  );
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [formData, setFormData] = useState({
    fullName: shippingInfo?.fullName ?? user?.name ?? "",
    email: shippingInfo?.email ?? user?.email ?? "",
    phone: shippingInfo?.phone ?? "",
    address: shippingInfo?.address ?? "",
    city: shippingInfo?.city ?? "",
    state: shippingInfo?.state ?? "",
    pincode: shippingInfo?.pincode ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const proceed = (info: ShippingInfo) => {
    setShippingInfo(info);
    setCheckoutStep("review");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.address) newErrors.address = "Required";
    if (!formData.city) newErrors.city = "Required";
    if (!formData.state) newErrors.state = "Required";
    if (!formData.pincode) newErrors.pincode = "Required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await new Promise((resolve) => setTimeout(resolve, 500));
    saveAddress(formData);
    proceed(formData);
  };

  // Saved-address chooser — shown when the customer already has address(es).
  if (mode === "select") {
    return (
      <div style={{ padding: "20px 0" }}>
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: T.faint,
            margin: "0 0 12px 0",
          }}
        >
          Deliver to a saved address
        </p>

        {displayAddresses.map((addr, i) => {
          const selected = i === selectedIdx;
          return (
            <button
              key={addr.id ?? i}
              type="button"
              onClick={() => setSelectedIdx(i)}
              style={{
                width: "100%",
                textAlign: "left",
                display: "flex",
                gap: 12,
                padding: "14px",
                marginBottom: 12,
                background: selected ? T.sage : T.surface,
                border: `1.5px solid ${selected ? T.forest : T.border}`,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <div style={{ paddingTop: 2 }}>
                <MapPin size={18} color={selected ? T.forest : T.faint} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: T.ink,
                    marginBottom: 4,
                  }}
                >
                  {addr.fullName}
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: T.muted,
                    lineHeight: 1.5,
                  }}
                >
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                  <br />
                  {addr.phone}
                </div>
              </div>
              {selected && (
                <div style={{ paddingTop: 2 }}>
                  <Check size={18} color={T.forest} />
                </div>
              )}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setMode("form")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 4,
            marginBottom: 20,
            fontSize: "0.8rem",
            fontWeight: 600,
            color: T.forest,
            background: "none",
            border: `1.5px dashed ${T.borderDk}`,
            borderRadius: 10,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <Plus size={16} /> Add a New Address
        </button>

        <button
          type="button"
          onClick={() => proceed(displayAddresses[selectedIdx])}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: T.forest,
            color: T.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Deliver Here <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px 0" }}>
      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Full Name
        </label>
        <input
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.9rem",
            border: `1px solid ${errors.fullName ? "#d4183d" : T.border}`,
            borderRadius: "8px",
            background: T.surface,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            Email
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.email ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            Phone
          </label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="9999999999"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.phone ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Address
        </label>
        <input
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Street address"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.9rem",
            border: `1px solid ${errors.address ? "#d4183d" : T.border}`,
            borderRadius: "8px",
            background: T.surface,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            City
          </label>
          <input
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.city ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            State
          </label>
          <input
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.state ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label
            style={{
              display: "block",
              fontSize: "0.8rem",
              fontWeight: 500,
              color: T.ink,
              marginBottom: 6,
            }}
          >
            Pincode
          </label>
          <input
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.pincode ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        Review Order <ArrowRight size={16} />
      </button>

      {displayAddresses.length > 0 && (
        <button
          type="button"
          onClick={() => setMode("select")}
          style={{
            width: "100%",
            padding: "12px",
            marginTop: 10,
            fontSize: "0.8rem",
            fontWeight: 500,
            background: "none",
            color: T.muted,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Use a saved address
        </button>
      )}
    </form>
  );
}

function ReviewOrder() {
  const { items, shippingInfo, setCheckoutStep, getTotal, getItemCount } =
    useCart();

  const labelStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: T.faint,
    margin: "0 0 8px 0",
  };

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Items */}
      <p style={labelStyle}>
        Order Summary ({getItemCount()} {getItemCount() === 1 ? "item" : "items"})
      </p>
      <div style={{ marginBottom: 24 }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: 12,
              paddingBottom: 12,
              marginBottom: 12,
              borderBottom: `1px solid ${T.border}`,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: T.surface,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: T.ink,
                  margin: "0 0 4px 0",
                }}
              >
                {item.name}
              </h4>
              {item.size && (
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: T.muted,
                    margin: "0 0 2px 0",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  Size: {item.size}
                </p>
              )}
              <p
                style={{
                  fontSize: "0.8rem",
                  color: T.muted,
                  margin: 0,
                }}
              >
                ₹{item.price.toLocaleString()} × {item.quantity}
              </p>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: T.ink,
                margin: 0,
                whiteSpace: "nowrap",
              }}
            >
              ₹{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Shipping address */}
      {shippingInfo && (
        <div style={{ marginBottom: 24 }}>
          <p style={labelStyle}>Delivery Address</p>
          <div
            style={{
              padding: "12px 14px",
              background: T.surface,
              borderRadius: 8,
              fontSize: "0.85rem",
              color: T.muted,
              lineHeight: 1.5,
            }}
          >
            <span style={{ color: T.ink, fontWeight: 600 }}>
              {shippingInfo.fullName}
            </span>
            <br />
            {shippingInfo.address}, {shippingInfo.city}, {shippingInfo.state} -{" "}
            {shippingInfo.pincode}
            <br />
            {shippingInfo.phone} · {shippingInfo.email}
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div
        style={{
          padding: "16px",
          background: T.surface,
          borderRadius: 8,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: "0.85rem", color: T.muted }}>Subtotal</span>
          <span style={{ fontSize: "0.85rem", color: T.ink }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: "0.85rem", color: T.muted }}>Shipping</span>
          <span style={{ fontSize: "0.85rem", color: T.forest }}>Free</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <span style={{ fontSize: "0.95rem", fontWeight: 600, color: T.ink }}>
            Total
          </span>
          <span style={{ fontSize: "0.95rem", fontWeight: 700, color: T.forest }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setCheckoutStep("payment")}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        Confirm &amp; Pay <ArrowRight size={16} />
      </button>

      <button
        type="button"
        onClick={() => setCheckoutStep("shipping")}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: 10,
          fontSize: "0.8rem",
          fontWeight: 500,
          background: "none",
          color: T.muted,
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Edit Delivery Details
      </button>
    </div>
  );
}

// Purely informational — Razorpay's own widget presents the real method
// picker and collects the payment instrument. We never see card/UPI/bank
// details ourselves.
const PAY_METHODS: { label: string; icon: typeof CreditCard }[] = [
  { label: "UPI", icon: Smartphone },
  { label: "Card", icon: CreditCard },
  { label: "Net Banking", icon: Building2 },
  { label: "Wallet", icon: Wallet },
];

function PaymentForm() {
  const { shippingInfo, setCheckoutStep, getTotal, clearCart } = useCart();
  const { isAuthenticated, openModal } = useAuth();
  const { loadOrder } = useOrders();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    setError(null);

    if (!shippingInfo) {
      setCheckoutStep("shipping");
      return;
    }
    if (!isAuthenticated) {
      setError("Sign in to complete your order — your cart is kept.");
      openModal("login");
      return;
    }

    setIsLoading(true);
    try {
      // Creates the real order (deducts stock, clears the server cart) and a
      // matching Razorpay order in one atomic call. If this throws, nothing
      // was created.
      const result = await checkoutApi.initiateCheckout({
        shipping_address: {
          full_name: shippingInfo.fullName,
          phone: shippingInfo.phone,
          line1: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
        },
      });

      await openRazorpayCheckout({
        key: result.razorpay_key_id,
        amount: result.amount_paise,
        currency: result.currency,
        order_id: result.razorpay_order_id,
        name: result.branding?.company_name || "SOIS Store",
        description: `Order ${result.order_number}`,
        prefill: result.prefill,
        theme: { color: result.branding?.primary_color || T.forest },
        handler: () => {
          // Razorpay confirmed the payment client-side; the order's true
          // paid/captured status is set server-side once the webhook lands.
          // Fetch the real order now so confirmation shows real data, and
          // reconcile status on the next Orders page visit / refresh().
          loadOrder(result.order_id).finally(() => {
            clearCart();
            setIsLoading(false);
            setCheckoutStep("confirmation");
          });
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            setError(
              "Payment wasn't completed. Your order is on hold for a few minutes — try again to finish paying."
            );
          },
        },
      });
    } catch (err) {
      setIsLoading(false);
      setError(
        err instanceof ApiError
          ? err.firstMessage
          : "We couldn't start checkout. Please try again."
      );
    }
  };

  return (
    <div style={{ padding: "20px 0" }}>
      {/* Method badges */}
      <div className="sois-pay-methods">
        {PAY_METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="sois-pay-tile" aria-hidden="true">
              <Icon size={18} />
              {m.label}
            </div>
          );
        })}
      </div>

      <p
        style={{
          fontSize: "0.82rem",
          color: T.muted,
          lineHeight: 1.6,
          margin: "14px 0 20px",
        }}
      >
        You&apos;ll choose UPI, card, net banking or a wallet inside
        Razorpay&apos;s secure checkout — we never see or store your payment
        details.
      </p>

      {error && (
        <p className="sois-pay-err" role="alert" style={{ marginBottom: 14 }}>
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePay}
        disabled={isLoading}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: T.forest,
          color: T.white,
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          opacity: isLoading ? 0.6 : 1,
        }}
      >
        {isLoading ? "Processing..." : `Pay ₹${getTotal().toLocaleString()}`}
      </button>

      <p
        style={{
          fontSize: "0.75rem",
          color: T.faint,
          textAlign: "center",
          marginTop: 12,
          marginBottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <ShieldCheck size={13} /> Secured by Razorpay · Encrypted payment
      </p>
    </div>
  );
}

function ConfirmationView() {
  const { closeCart } = useCart();
  const { lastOrder } = useOrders();

  return (
    <div style={{ textAlign: "center", padding: "40px 20px" }}>
      <div
        style={{
          fontSize: "3rem",
          marginBottom: 16,
        }}
      >
        ✓
      </div>

      <h3
        style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: T.ink,
          margin: "0 0 8px 0",
        }}
      >
        Order Confirmed!
      </h3>

      <p
        style={{
          fontSize: "0.9rem",
          color: T.muted,
          marginBottom: 24,
          lineHeight: 1.5,
        }}
      >
        Thank you for your purchase. A confirmation email has been sent to you.
      </p>

      <div
        style={{
          padding: "12px",
          background: T.surface,
          borderRadius: "8px",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: "0.75rem", color: T.faint, margin: 0, marginBottom: 4 }}>
          Order Number
        </p>
        <p
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            color: T.ink,
            margin: 0,
          }}
        >
          {lastOrder ? lastOrder.orderNumber ?? lastOrder.id : "—"}
        </p>
      </div>

      {lastOrder && (
        <Link
          href={`/account/orders/${lastOrder.id}`}
          onClick={closeCart}
          style={{
            display: "flex",
            width: "100%",
            padding: "12px",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            background: T.forest,
            color: T.white,
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            textDecoration: "none",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
            boxSizing: "border-box",
          }}
        >
          Track Order
        </Link>
      )}

      <button
        onClick={closeCart}
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "0.85rem",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: lastOrder ? T.white : T.forest,
          color: lastOrder ? T.forest : T.white,
          border: lastOrder ? `1.5px solid ${T.border}` : "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export function CartDrawer() {
  const {
    items,
    cartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    checkoutStep,
    setCheckoutStep,
    getTotal,
  } = useCart();

  if (!cartOpen) return null;

  // Previous step for the header back button. Cart is the first step and
  // confirmation is terminal (order placed), so neither shows a back button.
  const backStep =
    checkoutStep === "shipping"
      ? ("cart" as const)
      : checkoutStep === "review"
        ? ("shipping" as const)
        : checkoutStep === "payment"
          ? ("review" as const)
          : null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 9998,
          animation: "fadeIn 0.3s ease-out",
        }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          right: 0,
          top: 0,
          bottom: 0,
          width: "100%",
          maxWidth: 450,
          background: T.white,
          boxShadow: "-20px 0 60px rgba(0, 0, 0, 0.3)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          animation: "slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: `1px solid ${T.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {backStep && (
              <button
                onClick={() => setCheckoutStep(backStep)}
                aria-label="Go back"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: T.muted,
                  padding: "4px",
                  marginLeft: -8,
                  display: "flex",
                }}
              >
                <ChevronLeft size={22} />
              </button>
            )}
            <h2
              style={{
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: 600,
                color: T.ink,
              }}
            >
              {checkoutStep === "cart"
                ? "Shopping Bag"
                : checkoutStep === "shipping"
                  ? "Shipping Address"
                  : checkoutStep === "review"
                    ? "Review Order"
                    : checkoutStep === "payment"
                      ? "Payment Details"
                      : "Order Confirmed"}
            </h2>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: T.muted,
              padding: "4px",
              display: "flex",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            padding: "24px",
          }}
        >
          {checkoutStep === "cart" && (
            <>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", paddingTop: 40 }}>
                  <p style={{ color: T.muted, marginBottom: 8 }}>
                    Your bag is empty
                  </p>
                  <p style={{ fontSize: "0.85rem", color: T.faint, margin: 0 }}>
                    Add items to get started
                  </p>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        gap: 12,
                        paddingBottom: 16,
                        marginBottom: 16,
                        borderBottom: `1px solid ${T.border}`,
                      }}
                    >
                      <Link
                        href={productHref(item.name)}
                        onClick={closeCart}
                        aria-label={`View ${item.name}`}
                        style={{
                          width: 80,
                          height: 80,
                          background: T.surface,
                          borderRadius: 8,
                          overflow: "hidden",
                          flexShrink: 0,
                          display: "block",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Link>

                      <div style={{ flex: 1 }}>
                        <Link
                          href={productHref(item.name)}
                          onClick={closeCart}
                          style={{ textDecoration: "none" }}
                        >
                          <h4
                            onMouseEnter={(e) => (e.currentTarget.style.color = T.forest)}
                            onMouseLeave={(e) => (e.currentTarget.style.color = T.ink)}
                            style={{
                              fontSize: "0.9rem",
                              fontWeight: 600,
                              color: T.ink,
                              margin: "0 0 4px 0",
                              cursor: "pointer",
                              transition: "color 0.2s ease",
                            }}
                          >
                            {item.name}
                          </h4>
                        </Link>
                        {item.size && (
                          <p
                            style={{
                              fontSize: "0.74rem",
                              color: T.muted,
                              margin: "0 0 4px 0",
                              fontWeight: 600,
                              letterSpacing: "0.02em",
                            }}
                          >
                            Size: {item.size}
                          </p>
                        )}
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: T.muted,
                            margin: "0 0 8px 0",
                          }}
                        >
                          ₹{item.price.toLocaleString()}
                        </p>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: T.surface,
                            width: "fit-content",
                            borderRadius: 6,
                            padding: "4px 8px",
                          }}
                        >
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: T.forest,
                              padding: 4,
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span
                            style={{
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              minWidth: 20,
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: T.forest,
                              padding: 4,
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <p
                          style={{
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            color: T.ink,
                            margin: "0 0 16px 0",
                          }}
                        >
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#d4183d",
                            padding: 4,
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {checkoutStep === "shipping" && <ShippingForm />}
          {checkoutStep === "review" && <ReviewOrder />}
          {checkoutStep === "payment" && <PaymentForm />}
          {checkoutStep === "confirmation" && <ConfirmationView />}
        </div>

        {/* Footer */}
        {checkoutStep === "cart" && items.length > 0 && (
          <div
            style={{
              padding: "20px 24px",
              borderTop: `1px solid ${T.border}`,
              background: T.surface,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 16,
              }}
            >
              <span style={{ color: T.muted, fontSize: "0.9rem" }}>Total</span>
              <span style={{ fontWeight: 600, color: T.forest }}>
                ₹{getTotal().toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setCheckoutStep("shipping")}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "0.85rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                background: T.forest,
                color: T.white,
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              Proceed to Checkout <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(450px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @media (max-width: 768px) {
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(100%);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        }
      `}</style>
    </>
  );
}
