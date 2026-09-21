import Image from "next/image";
import { mediaUrl } from "@/lib/api";
import type { Review } from "@/lib/api";
import { Stars } from "./Stars";

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * One review in the site-wide feed. Shows which product it's about
 * (`product_name`) since this same card renders on the homepage and on
 * every product page, not scoped to the product currently on screen.
 */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="sois-review-card">
      <Stars rating={review.rating} size={14} />
      <div className="sois-review-product">{review.product_name}</div>
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
                sizes="44px"
                style={{ objectFit: "cover" }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="sois-review-meta">
        <span className="sois-review-name">{review.customer_name}</span>
        <span className="sois-review-date">
          {formatReviewDate(review.created_at)}
        </span>
      </div>
    </article>
  );
}
