import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductListing } from "@/components/store/ProductListing";
import { getAllProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop All Jewellery",
  description:
    "Browse the full SOIS collection of hallmarked 925 sterling silver jewellery — rings, earrings, necklaces, bracelets, anklets and gift sets.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const products = getAllProducts();

  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <span aria-current="page">Shop</span>
        </nav>
        <div className="sois-page-hero-eyebrow">THE COLLECTION</div>
        <h1 className="sois-page-hero-title">
          {q ? `Results for “${q}”` : "Shop All Jewellery"}
        </h1>
        <p className="sois-page-hero-sub">
          Hallmarked 925 sterling silver, handcrafted for everyday luxury.
        </p>
      </section>

      <section className="sois-listing">
        <Suspense fallback={<div className="sois-listing-layout" />}>
          <ProductListing products={products} query={q} />
        </Suspense>
      </section>
    </StoreShell>
  );
}
