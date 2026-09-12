import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { GiftHampersGrid } from "@/components/store/GiftHampersGrid";
import { getGiftHampers } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Gift Hampers",
  description:
    "Turn your SOIS jewellery order into a ready-to-gift package. Choose a gift hamper box at checkout — added on top of your order, one box holds up to four pieces.",
};

export default async function GiftHampersPage() {
  const hampers = await getGiftHampers();

  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">Gift Hampers</span>
        </nav>
        <div className="sois-page-hero-eyebrow">READY TO GIFT</div>
        <h1 className="sois-page-hero-title">Gift Hampers</h1>
        <p className="sois-page-hero-sub">
          Present your jewellery beautifully. Add a gift hamper to your order —
          one box holds up to four pieces, and we add the right number for you.
        </p>
      </section>

      <section className="sois-listing">
        <GiftHampersGrid hampers={hampers} />
      </section>
    </StoreShell>
  );
}
