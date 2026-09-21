"use client";

import { useRef, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { catalogApi, returnsApi, ApiError } from "@/lib/api";
import { Stars } from "./Stars";

const MAX_IMAGES = 5;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"];

interface PickedImage {
  file: File;
  previewUrl: string;
}

interface ReviewFormProps {
  productId: string;
  orderItemId: string;
  /** Called once the review itself has been created (photo uploads may
   *  still be in flight/failed — see the soft-warning handling below). */
  onDone?: () => void;
  onCancel?: () => void;
}

/**
 * Inline (not a modal) review form. On submit: create the review via
 * `submitReview`, then upload any attached photos against the new review's
 * id (presign → PUT to S3 → confirm). A photo upload failure after the
 * review was created successfully is a soft warning, not a hard failure —
 * the review already exists.
 */
export function ReviewForm({
  productId,
  orderItemId,
  onDone,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<PickedImage[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [posted, setPosted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const picked = Array.from(fileList).filter((f) =>
      ACCEPTED_MIME.includes(f.type)
    );
    setImages((prev) => {
      const room = Math.max(0, MAX_IMAGES - prev.length);
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
    if (submitting || posted) return;
    if (rating < 1) {
      setError("Please choose a star rating.");
      return;
    }

    setError(null);
    setWarning(null);
    setSubmitting(true);
    try {
      const review = await catalogApi.submitReview({
        product_id: productId,
        order_item_id: orderItemId,
        rating,
        title: title.trim() || undefined,
        body: body.trim() || undefined,
      });

      // Review is created — from here on, failures are soft warnings.
      let failedUploads = 0;
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
          await catalogApi.confirmReviewMedia(review.id, {
            s3_key: presign.s3_key,
            file_name: img.file.name,
            mime_type: img.file.type,
            file_size: img.file.size,
          });
        } catch {
          failedUploads += 1;
        }
      }

      setPosted(true);
      if (failedUploads > 0) {
        setWarning(
          failedUploads === 1
            ? "Review posted — one photo didn't upload."
            : `Review posted — ${failedUploads} photos didn't upload.`
        );
      }
      onDone?.();
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.firstMessage
          : "Couldn't post your review. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (posted) {
    return (
      <div className="sois-review-form-done">
        <p style={{ margin: 0 }}>
          Thanks for your review! It&apos;ll appear once approved.
        </p>
        {warning && <p className="sois-review-form-warning">{warning}</p>}
      </div>
    );
  }

  return (
    <form className="sois-review-form" onSubmit={handleSubmit}>
      <div className="sois-review-form-row">
        <Stars value={rating} onChange={setRating} size={22} />
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
        {images.length < MAX_IMAGES && (
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
          {submitting ? "Posting…" : "Post review"}
        </button>
      </div>
    </form>
  );
}
