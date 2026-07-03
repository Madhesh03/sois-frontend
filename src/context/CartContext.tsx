"use client";

import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type CheckoutStep =
  | "cart"
  | "shipping"
  | "review"
  | "payment"
  | "confirmation";

export interface CartContextType {
  items: CartItem[];
  cartOpen: boolean;
  checkoutOpen: boolean;
  checkoutStep: CheckoutStep;
  shippingInfo: ShippingInfo | null;
  savedAddresses: ShippingInfo[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  setShippingInfo: (info: ShippingInfo) => void;
  saveAddress: (info: ShippingInfo) => void;
  updateSavedAddress: (oldInfo: ShippingInfo, nextInfo: ShippingInfo) => void;
  removeSavedAddress: (info: ShippingInfo) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const SAVED_ADDRESSES_KEY = "sois_saved_addresses";

function loadSavedAddresses(): ShippingInfo[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SAVED_ADDRESSES_KEY);
    return raw ? (JSON.parse(raw) as ShippingInfo[]) : [];
  } catch {
    return [];
  }
}

function persistSavedAddresses(addresses: ShippingInfo[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses));
  } catch {
    /* ignore quota / serialization errors */
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingInfo[]>(
    loadSavedAddresses
  );

  const addToCart = (item: Omit<CartItem, "quantity">) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
    // Always surface the cart list (with quantity controls) when an item is
    // added — otherwise a stale checkout step (review/payment/confirmation)
    // from an earlier session would hide the quantity controls.
    setCheckoutStep("cart");
    setCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setShippingInfo(null);
    setCheckoutStep("cart");
  };

  const openCart = () => {
    setCheckoutStep("cart");
    setCartOpen(true);
  };
  const closeCart = () => setCartOpen(false);

  const saveAddress = (info: ShippingInfo) => {
    setSavedAddresses((prev) => {
      // Dedupe on the full address so re-using a saved address doesn't create
      // duplicates; most-recently-used moves to the front.
      const key = JSON.stringify(info);
      const next = [info, ...prev.filter((a) => JSON.stringify(a) !== key)];
      persistSavedAddresses(next);
      return next;
    });
  };

  const updateSavedAddress = (oldInfo: ShippingInfo, nextInfo: ShippingInfo) => {
    setSavedAddresses((prev) => {
      const key = JSON.stringify(oldInfo);
      // Replace in place so the address keeps its position in the list.
      const next = prev.map((a) => (JSON.stringify(a) === key ? nextInfo : a));
      persistSavedAddresses(next);
      return next;
    });
  };

  const removeSavedAddress = (info: ShippingInfo) => {
    setSavedAddresses((prev) => {
      const key = JSON.stringify(info);
      const next = prev.filter((a) => JSON.stringify(a) !== key);
      persistSavedAddresses(next);
      return next;
    });
  };
  const openCheckout = () => {
    setCheckoutOpen(true);
    setCheckoutStep("cart");
  };
  const closeCheckout = () => {
    setCheckoutOpen(false);
    setCheckoutStep("cart");
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        cartOpen,
        checkoutOpen,
        checkoutStep,
        shippingInfo,
        savedAddresses,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        openCheckout,
        closeCheckout,
        setCheckoutStep,
        setShippingInfo,
        saveAddress,
        updateSavedAddress,
        removeSavedAddress,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
