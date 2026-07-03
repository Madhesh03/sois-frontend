"use client";

import React, { createContext, useContext, useState } from "react";

export interface WishlistItem {
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

// Default static items so the wishlist is populated out of the box.
const DEFAULT_WISHLIST: WishlistItem[] = [
  {
    id: "wish-crescent-moon",
    name: "Crescent Moon Pendant",
    price: 1299,
    image:
      "https://images.unsplash.com/photo-1616294208582-c2a6d73b467b?w=600&h=720&fit=crop&auto=format&q=85",
    addedDate: new Date(),
  },
  {
    id: "wish-celestial-ring",
    name: "Celestial Stack Ring",
    price: 899,
    image:
      "https://images.unsplash.com/photo-1639660680788-bf160240864e?w=600&h=720&fit=crop&auto=format&q=85",
    addedDate: new Date(),
  },
  {
    id: "wish-cascade-hoop",
    name: "Cascade Hoop Earrings",
    price: 749,
    image:
      "https://images.unsplash.com/photo-1764591576264-ad2e0e4e793c?w=600&h=720&fit=crop&auto=format&q=85",
    addedDate: new Date(),
  },
];

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>(DEFAULT_WISHLIST);
  const [wishlistOpen, setWishlistOpen] = useState(false);

  const addToWishlist = (item: Omit<WishlistItem, "addedDate">) => {
    setItems((prevItems) => {
      const exists = prevItems.find((i) => i.id === item.id);
      if (exists) {
        return prevItems.filter((i) => i.id !== item.id);
      }
      return [...prevItems, { ...item, addedDate: new Date() }];
    });
  };

  const removeFromWishlist = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const isInWishlist = (id: string) => {
    return items.some((i) => i.id === id);
  };

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
