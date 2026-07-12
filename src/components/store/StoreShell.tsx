"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/home/Nav";
import { Footer } from "@/components/home/Footer";
import { CartDrawer } from "@/components/drawers/CartDrawer";
import { WishlistDrawer } from "@/components/drawers/WishlistDrawer";
import { AuthDrawer } from "@/components/drawers/AuthDrawer";
import { globalStyles, T } from "@/lib/tokens";

/**
 * Page chrome shared by all store pages (shop, category, product, …). Renders
 * the same fixed header, footer and overlay drawers as the homepage so the
 * brand experience is identical, and reserves top padding for the fixed nav.
 */
export function StoreShell({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="sois-root" style={{ background: T.bg, color: T.ink }}>
        <Nav scrolled={scrolled} />
        <main id="main-content" className="sois-store-main">
          {children}
        </main>
        <Footer />
      </div>

      <AuthDrawer />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}
