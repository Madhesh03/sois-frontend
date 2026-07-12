"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Modal } from "./Modal";
import { T } from "@/lib/tokens";
import { Trash2, Plus, Minus, Check } from "lucide-react";

function CartView() {
  const { items, removeFromCart, updateQuantity, openCheckout, getTotal } =
    useCart();

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <p style={{ fontSize: "0.95rem", color: T.muted, marginBottom: 24 }}>
          Your bag is empty
        </p>
        <p style={{ fontSize: "0.85rem", color: T.faint }}>
          Add items to get started shopping
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
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
            <div
              style={{
                width: 80,
                height: 80,
                background: T.surface,
                borderRadius: 8,
                overflow: "hidden",
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
            </div>

            <div style={{ flex: 1 }}>
              <h4
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  color: T.ink,
                  margin: 0,
                  marginBottom: 4,
                }}
              >
                {item.name}
              </h4>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: T.muted,
                  margin: 0,
                  marginBottom: 8,
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
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.forest,
                    padding: 4,
                    display: "flex",
                  }}
                >
                  <Minus size={14} />
                </button>
                <span
                  style={{
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: T.ink,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: T.forest,
                    padding: 4,
                    display: "flex",
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
                  margin: 0,
                  marginBottom: 16,
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
                  display: "flex",
                }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          padding: "16px 0",
          borderTop: `1px solid ${T.border}`,
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
          <span style={{ color: T.muted, fontSize: "0.9rem" }}>Subtotal</span>
          <span style={{ color: T.ink, fontWeight: 600, fontSize: "0.9rem" }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span style={{ color: T.muted, fontSize: "0.9rem" }}>Shipping</span>
          <span style={{ color: T.ink, fontSize: "0.9rem" }}>Free</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 8,
            borderTop: `1px solid ${T.border}`,
          }}
        >
          <span style={{ color: T.ink, fontWeight: 600, fontSize: "0.95rem" }}>
            Total
          </span>
          <span style={{ color: T.forest, fontWeight: 600, fontSize: "0.95rem" }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={openCheckout}
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
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#0D4A46";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = T.forest;
        }}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}

function ShippingForm() {
  const { setCheckoutStep, getTotal } = useCart();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsLoading(false);
    setCheckoutStep("payment");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
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
          marginBottom: 20,
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

      <div style={{ marginBottom: 20 }}>
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
          marginBottom: 20,
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

      <div
        style={{
          padding: "16px",
          background: T.surface,
          borderRadius: "8px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9rem", color: T.muted }}>Total</span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: T.forest }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
      </div>

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
        {isLoading ? "Processing..." : "Continue to Payment"}
      </button>
    </form>
  );
}

function PaymentForm() {
  const { setCheckoutStep, getTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let processedValue = value;

    if (name === "cardNumber") {
      processedValue = value.replace(/\s/g, "").slice(0, 16);
      processedValue = processedValue.replace(/(\d{4})/g, "$1 ").trim();
    } else if (name === "expiryDate") {
      processedValue = value.replace(/\D/g, "").slice(0, 4);
      if (processedValue.length >= 2) {
        processedValue = processedValue.slice(0, 2) + "/" + processedValue.slice(2);
      }
    } else if (name === "cvv") {
      processedValue = value.replace(/\D/g, "").slice(0, 3);
    }

    setFormData((prev) => ({ ...prev, [name]: processedValue }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, "").length !== 16)
      newErrors.cardNumber = "Invalid card number";
    if (!formData.cardName) newErrors.cardName = "Required";
    if (!formData.expiryDate || formData.expiryDate.length !== 5)
      newErrors.expiryDate = "Invalid expiry";
    if (!formData.cvv || formData.cvv.length !== 3)
      newErrors.cvv = "Invalid CVV";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    clearCart();
    setCheckoutStep("confirmation");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Card Number
        </label>
        <input
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.9rem",
            border: `1px solid ${errors.cardNumber ? "#d4183d" : T.border}`,
            borderRadius: "8px",
            background: T.surface,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "block",
            fontSize: "0.8rem",
            fontWeight: 500,
            color: T.ink,
            marginBottom: 6,
          }}
        >
          Cardholder Name
        </label>
        <input
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="John Doe"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: "0.9rem",
            border: `1px solid ${errors.cardName ? "#d4183d" : T.border}`,
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
          marginBottom: 20,
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
            Expiry Date
          </label>
          <input
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.expiryDate ? "#d4183d" : T.border}`,
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
            CVV
          </label>
          <input
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "0.9rem",
              border: `1px solid ${errors.cvv ? "#d4183d" : T.border}`,
              borderRadius: "8px",
              background: T.surface,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>

      <div
        style={{
          padding: "16px",
          background: T.surface,
          borderRadius: "8px",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.9rem", color: T.muted }}>Total Amount</span>
          <span style={{ fontSize: "0.9rem", fontWeight: 600, color: T.forest }}>
            ₹{getTotal().toLocaleString()}
          </span>
        </div>
      </div>

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
        {isLoading ? "Processing..." : "Complete Purchase"}
      </button>

      <p
        style={{
          fontSize: "0.75rem",
          color: T.faint,
          textAlign: "center",
          marginTop: 12,
          margin: 0,
        }}
      >
        Your payment information is secure and encrypted
      </p>
    </form>
  );
}

function ConfirmationView() {
  const { closeCheckout } = useCart();

  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div
        style={{
          width: 64,
          height: 64,
          background: "rgba(17, 94, 89, 0.1)",
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
        }}
      >
        <Check size={32} color={T.forest} />
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
        Thank you for your purchase. Your order has been successfully placed and a confirmation email has been sent to you.
      </p>

      <div
        style={{
          padding: "16px",
          background: T.surface,
          borderRadius: "8px",
          marginBottom: 20,
        }}
      >
        <p style={{ fontSize: "0.8rem", color: T.faint, margin: 0, marginBottom: 4 }}>
          Order Number
        </p>
        <p
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: T.ink,
            margin: 0,
          }}
        >
          #SOI{Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>

      <button
        onClick={closeCheckout}
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
        }}
      >
        Continue Shopping
      </button>
    </div>
  );
}

export function CartModal() {
  const {
    cartOpen,
    closeCart,
    checkoutOpen,
    closeCheckout,
    checkoutStep,
    setCheckoutStep,
  } = useCart();

  // Step back through the linear checkout flow. "cart" is the first step and
  // "confirmation" is terminal (order already placed), so neither has a back arrow.
  const checkoutBack =
    checkoutStep === "shipping"
      ? () => setCheckoutStep("cart")
      : checkoutStep === "payment"
        ? () => setCheckoutStep("shipping")
        : undefined;

  return (
    <>
      <Modal isOpen={cartOpen} onClose={closeCart} title="Shopping Bag" size="md">
        <CartView />
      </Modal>

      <Modal
        isOpen={checkoutOpen}
        onClose={closeCheckout}
        title={
          checkoutStep === "cart"
            ? "Review Bag"
            : checkoutStep === "shipping"
              ? "Shipping Address"
              : checkoutStep === "payment"
                ? "Payment Details"
                : "Order Confirmed"
        }
        size="md"
        onBack={checkoutBack}
      >
        {checkoutStep === "cart" && <CartView />}
        {checkoutStep === "shipping" && <ShippingForm />}
        {checkoutStep === "payment" && <PaymentForm />}
        {checkoutStep === "confirmation" && <ConfirmationView />}
      </Modal>
    </>
  );
}
