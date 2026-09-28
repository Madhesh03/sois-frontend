import Image from "next/image";
import { mediaUrl } from "@/lib/api";
import type { Review } from "@/lib/api";
import { Stars } from "./Stars";
import { formatReviewDate, reviewerInitials } from "./reviewStats";

/**
 * One review. Used both as a fixed-width carousel slide (homepage strip,
 * site-wide feed — shows `product_name`) and as a full-width list row
 * (product ratings & reviews module, already scoped to one product — hides
 * `product_name` via `showProduct={false}`).
 */
export function ReviewCard({
  review,
  variant = "carousel",
  showProduct = true,
}: {
  review: Review;
  variant?: "carousel" | "list";
  showProduct?: boolean;
}) {
  return (
    <article
      className={
        variant === "list"
          ? "sois-review-card sois-review-card--list"
          : "sois-review-card"
      }
    >
      <div className="sois-review-top">
        <div className="sois-review-avatar" aria-hidden="true">
          {reviewerInitials(review.customer_name)}
        </div>
        <div className="sois-review-top-text">
          <span className="sois-review-name">{review.customer_name}</span>
          <span className="sois-review-date">
            {formatReviewDate(review.created_at)}
          </span>
        </div>
        <span className="sois-review-rating-chip">
          <Stars rating={review.rating} size={12} />
        </span>
      </div>

      {showProduct && (
        <div className="sois-review-product">{review.product_name}</div>
      )}
      {review.title && <div className="sois-review-title">{review.title}</div>}
      {review.body && <p className="sois-review-body">{review.body}</p>}

      {review.images.length > 0 && (
        <div className="sois-review-thumbs">
          {review.images.slice(0, 5).map((img) => (
            <div key={img.id} className="sois-review-thumb">
              <Image
                src={mediaUrl(img.view_url || img.s3_key)}
                alt=""
                fill
                sizes="52px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
