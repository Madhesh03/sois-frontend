import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StoreShell } from "@/components/store/StoreShell";
import { ReviewsModule } from "@/components/reviews/ReviewsModule";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Ratings and reviews from SOIS customers.",
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <StoreShell>
      <div className="sois-rvpage">
        <Link href="/shop" className="sois-rvpage-back">
          <ChevronLeft size={16} /> Continue shopping
        </Link>
        <ReviewsModule />
      </div>
    </StoreShell>
  );
}
