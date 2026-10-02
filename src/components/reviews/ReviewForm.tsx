"use client";

import { useEffect, useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { catalogApi, returnsApi, ApiError } from "@/lib/api";
import type { Review, ReviewImage } from "@/lib/api";
import { Stars } from "./Stars";

const MAX_IMAGES = 5;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"];

export const RATING_LABELS = ["", "Very bad", "Bad", "Average", "Good", "Very good"];

interface PickedImage {
  file: File;
  previewUrl: string;
}

interface ReviewFormProps {
  productId: string;
  orderItemId: string;
  /** Edit mode: the customer's existing review to prefill and PATCH. */
  existing?: Review | null;
  /** Create mode: star already tapped on the orders list. */
  initialRating?: number;
  /** Called once the review itself has been saved, with the saved review
   *  (including its current photos) and an optional soft warning if some
   *  photo changes didn't go through. */
  onDone?: (review: Review, warning: string | null) => void;
  onCancel?: () => void;
}

/**
 * Create-or-edit review form. On submit: create (POST) or update (PATCH)
 * the review, then apply photo changes — delete removed existing photos and
 * upload new ones (presign → PUT to S3 → confirm). Photo failures after the
 * review itself saved are a soft warning, not a hard failure.
 */
export function ReviewForm({
  productId,
  orderItemId,
  existing,
  initialRating = 0,
  onDone,
  onCancel,
}: ReviewFormProps) {
  const isEdit = !!existing;
  const [rating, setRating] = useState(existing?.rating ?? initialRating);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [keptImages, setKeptImages] = useState<ReviewImage[]>(
    existing?.images ?? []
  );
  const [images, setImages] = useState<PickedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Revoke object URLs for picked photos when the form unmounts (unless
  // they were handed back as the saved review's photos — see handleSubmit).
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(
    () => () =>
      imagesRef.current.forEach((i) => URL.revokeObjectURL(i.previewUrl)),
    []
  );

  const totalImages = keptImages.length + images.length;

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const picked = Array.from(fileList).filter((f) =>
      ACCEPTED_MIME.includes(f.type)
    );
    setImages((prev) => {
      const room = Math.max(0, MAX_IMAGES - keptImages.length - prev.length);
      const next = picked.slice(0, room).map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...prev, ...next];
    });
  };

  const removeImage = (idx: number) => {
    setImages((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(idx, 1);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const review = existing
        ? await catalogApi.updateReview(existing.id, {
            rating,
            title: title.trim(),
            body: body.trim(),
          })
        : await catalogApi.submitReview({
            product_id: productId,
            order_item_id: orderItemId,
            rating,
            title: title.trim() || undefined,
            body: body.trim() || undefined,
          });

      // Review is saved — from here on, failures are soft warnings.
      let failed = 0;
      const finalImages: ReviewImage[] = [];

      const keptIds = new Set(keptImages.map((i) => i.id));
      for (const img of existing?.images ?? []) {
        if (keptIds.has(img.id)) {
          finalImages.push(img);
          continue;
        }
        try {
          await catalogApi.deleteReviewImage(review.id, img.id);
        } catch {
          failed += 1;
          finalImages.push(img);
        }
      }

      for (const img of images) {
        try {
          const presign = await catalogApi.presignReviewMedia(review.id, {
            file_name: img.file.name,
            mime_type: img.file.type,
          });
          await returnsApi.uploadToPresignedUrl(
            presign.presigned_url,
            img.file,
            img.file.type
          );
          const confirmed = await catalogApi.confirmReviewMedia(review.id, {
            s3_key: presign.s3_key,
            file_name: img.file.name,
            mime_type: img.file.type,
            file_size: img.file.size,
          });
          // Keep the local preview as the thumbnail until the next refetch
          // brings a real presigned view URL.
          finalImages.push({
            ...confirmed,
            view_url: confirmed.view_url || img.previewUrl,
          });
        } catch {
          failed += 1;
        }
      }
      // Previews now back `finalImages`; don't revoke them on unmount.
      imagesRef.current = [];

      const warning =
        failed === 0
          ? null
          : failed === 1
          ? "Review saved — one photo change didn't go through."
          : `Review saved — ${failed} photo changes didn't go through.`;
      onDone?.({ ...review, images: finalImages }, warning);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.firstMessage
          : "Couldn't save your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="sois-review-form" onSubmit={handleSubmit}>
      <div className="sois-review-form-row">
        <Stars value={rating} onChange={setRating} size={28} />
        {rating > 0 && (
          <span className="sois-review-form-rating-label">
            {RATING_LABELS[rating]}
          </span>
        )}
      </div>

      <input
        type="text"
        className="sois-review-form-input"
        placeholder="Title (optional)"
        maxLength={200}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="sois-review-form-textarea"
        placeholder="Share your experience with this product…"
        rows={4}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      <div className="sois-review-form-images">
        {keptImages.map((img) => (
          <div key={img.id} className="sois-review-form-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.view_url} alt="" />
            <button
              type="button"
              className="sois-review-form-thumb-remove"
              onClick={() =>
                setKeptImages((prev) => prev.filter((i) => i.id !== img.id))
              }
              aria-label="Remove photo"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {images.map((img, i) => (
          <div key={img.previewUrl} className="sois-review-form-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.previewUrl} alt="" />
            <button
              type="button"
              className="sois-review-form-thumb-remove"
              onClick={() => removeImage(i)}
              aria-label="Remove photo"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        {totalImages < MAX_IMAGES && (
          <button
            type="button"
            className="sois-review-form-add-photo"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus size={16} />
            <span>Add photo</span>
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <p className="sois-review-form-hint">
        {totalImages >= MAX_IMAGES
          ? `Maximum of ${MAX_IMAGES} photos reached.`
          : `Add up to ${MAX_IMAGES} photos (${totalImages}/${MAX_IMAGES}).`}
      </p>

      {error && <p className="sois-review-form-error">{error}</p>}

      <div className="sois-review-form-actions">
        {onCancel && (
          <button
            type="button"
            className="sois-review-form-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="sois-review-form-submit"
          disabled={submitting}
        >
          {submitting ? "Saving…" : isEdit ? "Update review" : "Submit review"}
        </button>
      </div>
    </form>
  );
}
