"use client";

import { useEffect, useState } from "react";
import { Nav } from "@/components/home/Nav";
import { TrustTicker } from "@/components/home/TrustTicker";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { EditorialBreak } from "@/components/home/EditorialBreak";
import { Products } from "@/components/home/Products";
import { StyledForEveryOccasion } from "@/components/home/StyledForEveryOccasion";
import { CraftsmanshipFocus } from "@/components/home/CraftsmanshipFocus";
import { Commitment } from "@/components/home/Commitment";
import { Personalisation } from "@/components/home/Personalisation";
import { BrandStory } from "@/components/home/BrandStory";
import { Faq } from "@/components/home/Faq";
import { Newsletter } from "@/components/home/Newsletter";
import { Footer } from "@/components/home/Footer";
import { CartDrawer } from "@/components/drawers/CartDrawer";
import { WishlistDrawer } from "@/components/drawers/WishlistDrawer";
import { AuthDrawer } from "@/components/drawers/AuthDrawer";
import { globalStyles, T } from "@/lib/tokens";

export function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Reveal sections with a subtle fade-up as they scroll into view.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("#main-content > *")
    ).slice(2);
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("sois-reveal-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );

    targets.forEach((el) => {
      el.classList.add("sois-reveal");
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add("sois-reveal-in");
      } else {
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, []);

  return (
    <>
      <style>{globalStyles}</style>
      <div className="sois-root" style={{ background: T.bg, color: T.ink }}>
        <Nav scrolled={scrolled} />
        <main id="main-content">
          <TrustTicker />
          <Hero />
          <CategoryGrid />
          <EditorialBreak />
          <Products />
          <StyledForEveryOccasion />
          <CraftsmanshipFocus />
          <Commitment />
          <Personalisation />
          <BrandStory />
          <Faq />
          <Newsletter />
        </main>
        <Footer />
      </div>

      {/* Inline drawers - open/close via context without URL change */}
      <AuthDrawer />
      <CartDrawer />
      <WishlistDrawer />
    </>
  );
}
