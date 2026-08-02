"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart, ShippingInfo } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useOrders } from "@/context/OrdersContext";
import { T } from "@/lib/tokens";
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
  const { isAuthenticated, user } = useAuth();

  // Signed-in customers get a sample address on file so the "choose a saved
  // address" experience is available before their first stored order. Guests
  // (or once real addresses exist) simply use the saved list.
  const displayAddresses: ShippingInfo[] =
    savedAddresses.length > 0
      ? savedAddresses
      : isAuthenticated
        ? [
            {
              fullName: user?.name ?? "Home",
              email: user?.email ?? "",
              phone: "98765 43210",
              address: "12 Radhakrishnan Salai, Mylapore",
              city: "Chennai",
              state: "Tamil Nadu",
              pincode: "600004",
            },
          ]
        : [];

  const [mode, setMode] = useState<"select" | "form">(
    displayAddresses.length > 0 ? "select" : "form"
  );
  const [selectedIdx, setSelectedIdx] = useState(0);

  const [formData, setFormData] = useState({
    fullName: shippingInfo?.fullName ?? "",
    email: shippingInfo?.email ?? "",
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
              key={i}
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

type PayMethod = "upi" | "card" | "netbanking" | "wallet";

const PAY_METHODS: { key: PayMethod; label: string; icon: typeof CreditCard }[] =
  [
    { key: "upi", label: "UPI", icon: Smartphone },
    { key: "card", label: "Card", icon: CreditCard },
    { key: "netbanking", label: "Net Banking", icon: Building2 },
    { key: "wallet", label: "Wallet", icon: Wallet },
  ];

const METHOD_LABEL: Record<PayMethod, string> = {
  upi: "UPI",
  card: "Card",
  netbanking: "Net Banking",
  wallet: "Wallet",
};

const BANKS = [
  "HDFC Bank",
  "ICICI Bank",
  "State Bank of India",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Punjab National Bank",
];

const WALLETS = ["Paytm", "PhonePe", "Amazon Pay", "Mobikwik", "Freecharge"];

function PaymentForm() {
  const { items, shippingInfo, setCheckoutStep, getTotal, clearCart } =
    useCart();
  const { createOrder } = useOrders();

  const [method, setMethod] = useState<PayMethod>("upi");
  const [card, setCard] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [bank, setBank] = useState("");
  const [wallet, setWallet] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 500,
    color: T.ink,
    marginBottom: 6,
  };
  const inputStyle = (err?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "10px 12px",
    fontSize: "0.9rem",
    border: `1px solid ${err ? "#d4183d" : T.border}`,
    borderRadius: "8px",
    background: T.surface,
    boxSizing: "border-box",
  });

  const clearErr = (name: string) => {
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let v = value;
    if (name === "cardNumber") {
      v = value.replace(/\s/g, "").slice(0, 16).replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      v = value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2);
    } else if (name === "cvv") {
      v = value.replace(/\D/g, "").slice(0, 3);
    }
    setCard((prev) => ({ ...prev, [name]: v }));
    clearErr(name);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (method === "upi") {
      if (!/^[\w.-]{2,}@[a-zA-Z]{2,}$/.test(upiId))
        e.upiId = "Enter a valid UPI ID (e.g. name@bank)";
    } else if (method === "card") {
      if (card.cardNumber.replace(/\s/g, "").length !== 16)
        e.cardNumber = "Invalid card";
      if (!card.cardName) e.cardName = "Required";
      if (card.expiryDate.length !== 5) e.expiryDate = "Invalid";
      if (card.cvv.length !== 3) e.cvv = "Invalid";
    } else if (method === "netbanking") {
      if (!bank) e.bank = "Select a bank";
    } else if (method === "wallet") {
      if (!wallet) e.wallet = "Select a wallet";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    // ────────────────────────────────────────────────────────────────
    // RAZORPAY INTEGRATION POINT
    // When the backend exposes the payment APIs, replace this simulated
    // delay with the real Razorpay flow:
    //   1. POST cart total to your backend → it creates a Razorpay Order
    //      and returns { orderId, amount, currency, razorpayKey }.
    //   2. Open Razorpay Checkout with that orderId and the selected
    //      `method` (upi / card / netbanking / wallet).
    //   3. On the handler success callback, verify the signature on your
    //      backend, then continue below (createOrder + confirmation).
    //      On failure/dismiss, setIsLoading(false) and show an error.
    // The chosen method is already captured in `METHOD_LABEL[method]`.
    // ────────────────────────────────────────────────────────────────
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const subtotal = getTotal();
    createOrder({
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        image: i.image,
        quantity: i.quantity,
        size: i.size,
      })),
      shipping:
        shippingInfo ?? {
          fullName: card.cardName,
          email: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
        },
      paymentMethod: METHOD_LABEL[method],
      subtotal,
      shippingFee: 0,
      total: subtotal,
    });

    setIsLoading(false);
    clearCart();
    setCheckoutStep("confirmation");
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: "20px 0" }}>
      {/* Method selector */}
      <div className="sois-pay-methods">
        {PAY_METHODS.map((m) => {
          const Icon = m.icon;
          const active = method === m.key;
          return (
            <button
              key={m.key}
              type="button"
              aria-pressed={active}
              className={`sois-pay-tile${active ? " active" : ""}`}
              onClick={() => {
                setMethod(m.key);
                setErrors({});
              }}
            >
              <Icon size={18} />
              {m.label}
            </button>
          );
        })}
      </div>

      {/* UPI */}
      {method === "upi" && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>UPI ID</label>
          <input
            value={upiId}
            onChange={(e) => {
              setUpiId(e.target.value);
              clearErr("upiId");
            }}
            placeholder="yourname@upi"
            style={inputStyle(!!errors.upiId)}
          />
          {errors.upiId && (
            <p className="sois-pay-err">{errors.upiId}</p>
          )}
        </div>
      )}

      {/* Card */}
      {method === "card" && (
        <>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Card Number</label>
            <input
              name="cardNumber"
              value={card.cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              style={inputStyle(!!errors.cardNumber)}
            />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Cardholder Name</label>
            <input
              name="cardName"
              value={card.cardName}
              onChange={handleCardChange}
              placeholder="John Doe"
              style={inputStyle(!!errors.cardName)}
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
              <label style={labelStyle}>Expiry</label>
              <input
                name="expiryDate"
                value={card.expiryDate}
                onChange={handleCardChange}
                placeholder="MM/YY"
                style={inputStyle(!!errors.expiryDate)}
              />
            </div>
            <div>
              <label style={labelStyle}>CVV</label>
              <input
                name="cvv"
                value={card.cvv}
                onChange={handleCardChange}
                placeholder="123"
                style={inputStyle(!!errors.cvv)}
              />
            </div>
          </div>
        </>
      )}

      {/* Net Banking */}
      {method === "netbanking" && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Select Bank</label>
          <select
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
              clearErr("bank");
            }}
            style={inputStyle(!!errors.bank)}
          >
            <option value="">Choose your bank</option>
            {BANKS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          {errors.bank && <p className="sois-pay-err">{errors.bank}</p>}
        </div>
      )}

      {/* Wallet */}
      {method === "wallet" && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Select Wallet</label>
          <select
            value={wallet}
            onChange={(e) => {
              setWallet(e.target.value);
              clearErr("wallet");
            }}
            style={inputStyle(!!errors.wallet)}
          >
            <option value="">Choose your wallet</option>
            {WALLETS.map((w) => (
              <option key={w} value={w}>
                {w}
              </option>
            ))}
          </select>
          {errors.wallet && <p className="sois-pay-err">{errors.wallet}</p>}
        </div>
      )}

      <button
        type="submit"
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
    </form>
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
          {lastOrder ? lastOrder.id : "SOIS-XXXXXX"}
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
