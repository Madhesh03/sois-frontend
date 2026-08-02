/** Customer return endpoints (`/orders/{order_id}/return/`, `/orders/returns/*`). */
import { apiDelete, apiGet, apiPost } from "./client";
import type {
  Return,
  ReturnMedia,
  ReturnMediaPresign,
  ReturnReason,
} from "./types";

export function requestReturn(
  orderId: string,
  input: { reason: ReturnReason; customer_note?: string }
): Promise<Return> {
  return apiPost<Return>(`/orders/${orderId}/return/`, input);
}

export function getReturn(returnId: string): Promise<Return> {
  return apiGet<Return>(`/orders/returns/${returnId}/`);
}

/** Step 1 of the unboxing-evidence upload: get a presigned S3 PUT URL. */
export function presignReturnMedia(
  returnId: string,
  input: { media_type: "image" | "video"; file_name: string; mime_type: string }
): Promise<ReturnMediaPresign> {
  return apiPost<ReturnMediaPresign>(
    `/orders/returns/${returnId}/media/presign/`,
    input
  );
}

/** Step 2: PUT the raw file bytes straight to S3 at the presigned URL. */
export async function uploadToPresignedUrl(
  presignedUrl: string,
  file: File | Blob,
  mimeType: string
): Promise<void> {
  const res = await fetch(presignedUrl, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`S3 upload failed with status ${res.status}`);
  }
}

/** Step 3: confirm the upload so the backend creates the ReturnMedia record. */
export function confirmReturnMedia(
  returnId: string,
  input: {
    s3_key: string;
    media_type: "image" | "video";
    file_name?: string;
    mime_type?: string;
    file_size?: number | null;
  }
): Promise<ReturnMedia> {
  return apiPost<ReturnMedia>(
    `/orders/returns/${returnId}/media/confirm/`,
    input
  );
}

export function deleteReturnMedia(
  returnId: string,
  mediaId: string
): Promise<{ success: boolean }> {
  return apiDelete(`/orders/returns/${returnId}/media/${mediaId}/`);
}
