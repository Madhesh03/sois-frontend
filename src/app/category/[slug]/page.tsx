import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { ProductListing } from "@/components/store/ProductListing";
import {
  categories,
  getCategoryBySlug,
  getProductsByCategory,
  CategorySlug,
} from "@/lib/catalog";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: `${category.name} — 925 Sterling Silver`,
    description: `Shop SOIS ${category.name.toLowerCase()} — ${category.tagline}. Hallmarked 925 sterling silver, free shipping over ₹999.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : undefined;
  const products = getProductsByCategory(slug as CategorySlug);

  return (
    <StoreShell>
      <section className="sois-page-hero">
        <nav className="sois-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <ChevronRight size={13} />
          <Link href="/shop">Shop</Link>
          <ChevronRight size={13} />
          <span aria-current="page">{category.name}</span>
        </nav>
        <div className="sois-page-hero-eyebrow">CATEGORY</div>
        <h1 className="sois-page-hero-title">{category.name}</h1>
        <p className="sois-page-hero-sub">{category.tagline}</p>
      </section>

      <section className="sois-listing">
        <Suspense fallback={<div className="sois-listing-layout" />}>
          <ProductListing
            products={products}
            showCategoryFilter={false}
            query={q}
          />
        </Suspense>
      </section>
    </StoreShell>
  );
}
