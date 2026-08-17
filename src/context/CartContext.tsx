"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cartApi, mediaUrl } from "@/lib/api";
import type { Cart as ApiCart } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface CartItem {
  /**
   * Cart-line identity. For sized products a product can appear as multiple
   * lines (one per size), so this is a composite `${productId}::${size}` key;
   * for unsized products it's just the product id. Use this for update/remove.
   */
  id: string;
  /** The underlying product id (UUID) — for product links / add calls. */
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
}

/** Shape passed to `addToCart` — `id` is the product id. */
export interface AddToCartInput {
  id: string;
  name: string;
  price: number;
  image: string;
  size?: string;
}

/** Composite cart-line key: product id, plus size for sized products. */
function lineKeyFor(productId: string, size?: string): string {
  const s = (size || "").trim();
  return s ? `${productId}::${s}` : productId;
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
  addToCart: (item: AddToCartInput) => void;
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
// Server cart items carry no image/display metadata, so we cache the bits the
// UI needs (name/price/image) keyed by product id as items are added.
const CART_META_KEY = "sois_cart_meta";

// Keyed by composite line key (see lineKeyFor). Caches the display fields the
// server cart doesn't carry so lines render richly after a refetch.
type CartMeta = Record<
  string,
  { productId: string; name: string; price: number; image: string; size?: string }
>;

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

function loadCartMeta(): CartMeta {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(CART_META_KEY);
    return raw ? (JSON.parse(raw) as CartMeta) : {};
  } catch {
    return {};
  }
}

function persistCartMeta(meta: CartMeta) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_META_KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("cart");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<ShippingInfo[]>(
    loadSavedAddresses
  );

  // composite line key → server cart-item id, for update/remove API calls.
  const itemIdByLine = useRef<Record<string, string>>({});
  const meta = useRef<CartMeta>({});

  useEffect(() => {
    meta.current = loadCartMeta();
  }, []);

  /** Reconcile local state from an authoritative server cart response. */
  const applyCart = (cart: ApiCart) => {
    const map: Record<string, string> = {};
    const next: CartItem[] = cart.items.map((ci) => {
      const size = ci.selected_size || undefined;
      const key = lineKeyFor(ci.product_id, size);
      map[key] = ci.id;
      const cached = meta.current[key];
      return {
        id: key,
        productId: ci.product_id,
        name: cached?.name ?? ci.product_name,
        price: cached?.price ?? Number(ci.unit_price_at_add),
        image: cached?.image ?? mediaUrl(undefined),
        quantity: ci.quantity,
        size: size || cached?.size || undefined,
      };
    });
    itemIdByLine.current = map;
    setItems(next);
  };

  const syncCart = async () => {
    try {
      applyCart(await cartApi.getCart());
    } catch {
      /* offline / backend down — keep optimistic local state */
    }
  };

  // Load the server cart on mount and whenever auth flips (the guest cart is
  // merged into the customer cart on login by AuthContext).
  useEffect(() => {
    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const rememberMeta = (key: string, item: AddToCartInput) => {
    meta.current[key] = {
      productId: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      size: item.size,
    };
    persistCartMeta(meta.current);
  };

  const addToCart = (item: AddToCartInput) => {
    const size = item.size?.trim() || undefined;
    const key = lineKeyFor(item.id, size);
    rememberMeta(key, { ...item, size });

    // Optimistic local update for instant feedback.
    setItems((prev) => {
      const existing = prev.find((i) => i.id === key);
      if (existing) {
        return prev.map((i) =>
          i.id === key ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: key,
          productId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: 1,
          size,
        },
      ];
    });
    // Always surface the cart list when an item is added.
    setCheckoutStep("cart");
    setCartOpen(true);

    cartApi
      .addItem({
        product_id: item.id,
        quantity: 1,
        selected_size: size,
      })
      .then(applyCart)
      .catch(() => {
        /* keep optimistic state if the API is unreachable */
      });
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    const cartItemId = itemIdByLine.current[id];
    if (!cartItemId) return;
    cartApi
      .removeItem(cartItemId)
      .then(syncCart)
      .catch(() => {
        /* ignore */
      });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
    const cartItemId = itemIdByLine.current[id];
    if (!cartItemId) {
      syncCart();
      return;
    }
    cartApi
      .updateItem(cartItemId, quantity)
      .then((res) => {
        if (res && typeof res === "object" && "items" in res) {
          applyCart(res as ApiCart);
        } else {
          syncCart();
        }
      })
      .catch(() => {
        /* ignore */
      });
  };

  const clearCart = () => {
    setItems([]);
    setShippingInfo(null);
    setCheckoutStep("cart");
    cartApi.clearCart().catch(() => {
      /* ignore */
    });
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
