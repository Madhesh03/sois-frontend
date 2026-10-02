"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOrders, type OrderItem } from "@/context/OrdersContext";
import { mediaUrl, type Review } from "@/lib/api";
import { ReviewForm, RATING_LABELS } from "./ReviewForm";
import { Stars } from "./Stars";

interface ItemReviewPanelProps {
  item: OrderItem;
  /** Open the review sheet on mount (review-request email deep link). */
  autoOpen?: boolean;
}

/**
 * Myntra-style rating strip shown under a delivered order item. Unreviewed:
 * tappable empty stars — tapping one opens the review sheet with that rating
 * preselected. Reviewed: the customer's stars plus "View Review" — a review is
 * write-once, so after submitting it's shown read-only (no edit).
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
          {review ? "View Review" : "Write Review"}
        </button>
      </div>

      {sheetRating !== null && (
        <ReviewSheet item={item} onClose={() => setSheetRating(null)}>
          {review ? (
            <ReviewView review={review} />
          ) : (
            <ReviewForm
              productId={item.id}
              orderItemId={item.orderItemId}
              initialRating={sheetRating}
              onCancel={() => setSheetRating(null)}
              onDone={(saved, warn) => {
                setItemReview(item.orderItemId, saved);
                setWarning(warn);
                setSheetRating(null);
              }}
            />
          )}
        </ReviewSheet>
      )}
    </>
  );
}

/** Read-only view of a submitted review — reviews are write-once, no editing. */
function ReviewView({ review }: { review: Review }) {
  // Tapping a photo opens it full-size in the shared review lightbox
  // (.sois-rvw-lightbox, z-index above the review sheet).
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="sois-review-form sois-review-view">
      <div className="sois-review-form-row">
        <Stars rating={review.rating} size={28} />
        {review.rating > 0 && (
          <span className="sois-review-form-rating-label">
            {RATING_LABELS[review.rating]}
          </span>
        )}
      </div>

      {review.title && <div className="sois-review-title">{review.title}</div>}
      {review.body && <p className="sois-review-body">{review.body}</p>}

      {review.images.length > 0 && (
        <div className="sois-review-form-images">
          {review.images.map((img) => {
            const url = mediaUrl(img.view_url || img.s3_key);
            return (
              <button
                key={img.id}
                type="button"
                className="sois-review-form-thumb"
                style={{ border: "none", padding: 0, cursor: "zoom-in" }}
                onClick={() => setLightbox(url)}
                aria-label="View photo"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" />
              </button>
            );
          })}
        </div>
      )}

      {review.is_rejected && (
        <p className="sois-review-form-error">
          Your review isn&apos;t published as it didn&apos;t meet our review
          guidelines.
        </p>
      )}

      {lightbox && (
        <div className="sois-rvw-lightbox" onClick={() => setLightbox(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="" />
        </div>
      )}
    </div>
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
        aria-label={item.myReview ? "Your review" : "Write a review"}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sois-review-sheet-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image} alt="" />
          <div className="sois-review-sheet-title">
            <span>{item.myReview ? "Your review" : "Rate this product"}</span>
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
