"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { wishlistApi, mediaUrl } from "@/lib/api";
import type { WishlistItem as ApiWishlistItem } from "@/lib/api";
import { useAuth } from "./AuthContext";

export interface WishlistItem {
  /** Product id (UUID) — matches how ProductCard identifies products. */
  id: string;
  name: string;
  price: number;
  image: string;
  addedDate: Date;
}

export interface WishlistContextType {
  items: WishlistItem[];
  wishlistOpen: boolean;
  addToWishlist: (item: Omit<WishlistItem, "addedDate">) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

const GUEST_KEY = "sois_wishlist_guest";

function mapApiItem(w: ApiWishlistItem): WishlistItem {
  return {
    id: w.product_id,
    name: w.product_name,
    price: Number(w.price_at_add),
    image: mediaUrl(w.thumbnail_key),
    addedDate: new Date(w.added_at),
  };
}

function loadGuest(): WishlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(GUEST_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as WishlistItem[]).map((i) => ({
      ...i,
      addedDate: new Date(i.addedDate),
    }));
  } catch {
    return [];
  }
}

function persistGuest(items: WishlistItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  // Load the wishlist from the API (authenticated) or localStorage (guest),
  // and re-sync whenever auth state flips.
  useEffect(() => {
    let active = true;
    (async () => {
      if (isAuthenticated) {
        try {
          const apiItems = await wishlistApi.listWishlist();
          if (active) setItems(apiItems.map(mapApiItem));
        } catch {
          if (active) setItems([]);
        }
      } else {
        setItems(loadGuest());
      }
    })();
    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const inList = useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const addToWishlist = (item: Omit<WishlistItem, "addedDate">) => {
    const exists = inList(item.id);

    // Optimistic local update (toggle — matches prior behaviour).
    setItems((prev) => {
      const next = exists
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, { ...item, addedDate: new Date() }];
      if (!isAuthenticated) persistGuest(next);
      return next;
    });

    if (!isAuthenticated) return;
    // Persist to the backend; refresh on failure to stay consistent.
    const call = exists
      ? wishlistApi.removeFromWishlist(item.id)
      : wishlistApi.addToWishlist(item.id);
    call.catch(async () => {
      try {
        setItems((await wishlistApi.listWishlist()).map(mapApiItem));
      } catch {
        /* ignore */
      }
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (!isAuthenticated) persistGuest(next);
      return next;
    });
    if (isAuthenticated) {
      wishlistApi.removeFromWishlist(id).catch(() => {
        /* ignore */
      });
    }
  };

  const isInWishlist = (id: string) => inList(id);

  const openWishlist = () => setWishlistOpen(true);
  const closeWishlist = () => setWishlistOpen(false);

  const getWishlistCount = () => items.length;

  return (
    <WishlistContext.Provider
      value={{
        items,
        wishlistOpen,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        openWishlist,
        closeWishlist,
        getWishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
