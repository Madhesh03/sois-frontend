"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { cartApi, addressApi, mediaUrl } from "@/lib/api";
import type { Cart as ApiCart, Address as ApiAddress } from "@/lib/api";
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
  /** Backend Address id — present only for a saved address; absent for a
   *  one-off address typed at checkout and never saved. */
  id?: string;
  fullName: string;
  /** Display-only. The backend address book has no email field — orders
   *  carry the signed-in customer's account email instead. */
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
  /** No-op for guests — the address book is a signed-in customer feature
   *  (the backend endpoint requires auth); the typed address still applies
   *  to this checkout via `shippingInfo`, it just isn't persisted. */
  saveAddress: (info: ShippingInfo) => void;
  updateSavedAddress: (oldInfo: ShippingInfo, nextInfo: ShippingInfo) => void;
  removeSavedAddress: (info: ShippingInfo) => void;
  getTotal: () => number;
  getItemCount: () => number;
}

// Server cart items carry no image/display metadata, so we cache the bits the
// UI needs (name/price/image) keyed by product id as items are added.
const CART_META_KEY = "sois_cart_meta";

// Keyed by composite line key (see lineKeyFor). Caches the display fields the
// server cart doesn't carry so lines render richly after a refetch.
type CartMeta = Record<
  string,
  { productId: string; name: string; price: number; image: string; size?: string }
>;

/** Backend Address -> UI ShippingInfo. `email` has no backend counterpart. */
function mapAddress(a: ApiAddress): ShippingInfo {
  return {
    id: a.id,
    fullName: a.full_name,
    email: "",
    phone: a.phone,
    address: [a.line1, a.line2].filter(Boolean).join(", "),
    city: a.city,
    state: a.state,
    pincode: a.pincode,
  };
}

function toAddressInput(info: ShippingInfo) {
  return {
    full_name: info.fullName,
    phone: info.phone,
    line1: info.address,
    city: info.city,
    state: info.state,
    pincode: info.pincode,
  };
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
  const [savedAddresses, setSavedAddresses] = useState<ShippingInfo[]>([]);

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

  /** Reload the address book from the backend. No-op (empty) for guests —
   *  there is no local fallback; the endpoint requires a signed-in customer. */
  const syncAddresses = async () => {
    if (!isAuthenticated) {
      setSavedAddresses([]);
      return;
    }
    try {
      setSavedAddresses((await addressApi.listAddresses()).map(mapAddress));
    } catch {
      /* offline / backend down — keep whatever's currently shown */
    }
  };

  useEffect(() => {
    syncAddresses();
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

  /**
   * Persist a newly-typed address to the real address book. Guests are
   * silently skipped (no backend record to create) — the typed address still
   * flows through `shippingInfo` for this checkout via `proceed()` in
   * ShippingForm, it just isn't saved for next time.
   */
  const saveAddress = (info: ShippingInfo) => {
    if (!isAuthenticated) return;
    // Optimistic placeholder so it appears instantly; replaced by the real
    // record (with its backend id) once the create call resolves.
    setSavedAddresses((prev) => [info, ...prev]);
    addressApi
      .createAddress(toAddressInput(info))
      .then(syncAddresses)
      .catch(syncAddresses);
  };

  const updateSavedAddress = (oldInfo: ShippingInfo, nextInfo: ShippingInfo) => {
    if (!oldInfo.id) return;
    setSavedAddresses((prev) =>
      prev.map((a) => (a.id === oldInfo.id ? { ...nextInfo, id: oldInfo.id } : a))
    );
    addressApi
      .updateAddress(oldInfo.id, toAddressInput(nextInfo))
      .then(syncAddresses)
      .catch(syncAddresses);
  };

  const removeSavedAddress = (info: ShippingInfo) => {
    if (!info.id) return;
    setSavedAddresses((prev) => prev.filter((a) => a.id !== info.id));
    addressApi.deleteAddress(info.id).catch(syncAddresses);
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
