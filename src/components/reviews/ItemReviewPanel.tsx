"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOrders, type OrderItem } from "@/context/OrdersContext";
import { ReviewForm } from "./ReviewForm";
import { Stars } from "./Stars";

interface ItemReviewPanelProps {
  item: OrderItem;
  /** Open the review sheet on mount (review-request email deep link). */
  autoOpen?: boolean;
}

/**
 * Myntra-style rating strip shown under a delivered order item. Unreviewed:
 * tappable empty stars — tapping one opens the review sheet with that rating
 * preselected. Reviewed: the customer's stars plus "Edit Review".
 */
export function ItemReviewPanel({ item, autoOpen = false }: ItemReviewPanelProps) {
  const { setItemReview } = useOrders();
  const [sheetRating, setSheetRating] = useState<number | null>(
    autoOpen ? 0 : null
  );
  const [warning, setWarning] = useState<string | null>(null);
  const review = item.myReview;

  const open = (rating: number) => {
    setWarning(null);
    setSheetRating(rating);
  };

  return (
    <>
      <div className="sois-item-review">
        <div className="sois-item-review-main">
          {review ? (
            <Stars rating={review.rating} size={24} />
          ) : (
            <Stars value={0} onChange={open} size={24} />
          )}
          <span className="sois-item-review-caption">
            {!review
              ? "Rate & review this product"
              : review.is_rejected
              ? "Your review isn't published"
              : "Thanks for your review!"}
          </span>
          {warning && <span className="sois-item-review-warning">{warning}</span>}
        </div>
        <button
          type="button"
          className="sois-item-review-cta"
          onClick={() => open(review?.rating ?? 0)}
        >
          {review ? "Edit Review" : "Write Review"}
        </button>
      </div>

      {sheetRating !== null && (
        <ReviewSheet item={item} onClose={() => setSheetRating(null)}>
          <ReviewForm
            productId={item.id}
            orderItemId={item.orderItemId}
            existing={review}
            initialRating={sheetRating}
            onCancel={() => setSheetRating(null)}
            onDone={(saved, warn) => {
              setItemReview(item.orderItemId, saved);
              setWarning(warn);
              setSheetRating(null);
            }}
          />
        </ReviewSheet>
      )}
    </>
  );
}

/** Bottom sheet on mobile, centred dialog on desktop. */
function ReviewSheet({
  item,
  onClose,
  children,
}: {
  item: OrderItem;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div className="sois-review-sheet-backdrop" onClick={onClose}>
      <div
        className="sois-review-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={item.myReview ? "Edit your review" : "Write a review"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sois-review-sheet-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" />
          <div className="sois-review-sheet-title">
            <span>{item.myReview ? "Edit your review" : "Rate this product"}</span>
            <strong>{item.name}</strong>
          </div>
          <button
            type="button"
            className="sois-review-sheet-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
