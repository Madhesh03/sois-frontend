/** Public catalog endpoints (`/catalog/*`). */
import { apiGetWithMeta, apiGet, apiPost } from "./client";
import type {
  ApiCategory,
  ApiCollection,
  PageMeta,
  ProductDetail,
  ProductListItem,
  ProductQuery,
  Review,
  ReviewImage,
  ReviewMediaPresign,
} from "./types";

export interface ProductPage {
  items: ProductListItem[];
  meta: PageMeta;
}

/** Search / list products. Returns items plus pagination meta. */
export async function listProducts(
  query: ProductQuery = {},
  signal?: AbortSignal
): Promise<ProductPage> {
  const { data, meta } = await apiGetWithMeta<ProductListItem[]>(
    "/catalog/products/",
    {
      auth: false,
      signal,
      params: {
        q: query.q,
        category: query.category,
        collection: query.collection,
        metal_type: query.metal_type,
        min_price: query.min_price,
        max_price: query.max_price,
        in_stock: query.in_stock,
        featured: query.featured,
        gift_hamper: query.gift_hamper ? "true" : undefined,
        ordering: query.ordering,
        page: query.page,
        page_size: query.page_size,
      },
    }
  );
  const m = (meta as PageMeta) ?? {
    total: data.length,
    page: 1,
    page_size: data.length,
  };
  return { items: data, meta: m };
}

export function getProduct(
  slug: string,
  signal?: AbortSignal
): Promise<ProductDetail> {
  return apiGet<ProductDetail>(
    `/catalog/products/${encodeURIComponent(slug)}/`,
    { auth: false, signal }
  );
}

/**
 * Best-selling products for the storefront's "Top Products" section. Ranked
 * server-side by units sold, topped up with featured/new items.
 */
export function listTopProducts(
  limit = 8,
  signal?: AbortSignal
): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>("/catalog/products/top/", {
    auth: false,
    signal,
    params: { limit },
  });
}

/** "You may also like" recommendations for a product. */
export function listRelatedProducts(
  slug: string,
  limit = 4,
  signal?: AbortSignal
): Promise<ProductListItem[]> {
  return apiGet<ProductListItem[]>(
    `/catalog/products/${encodeURIComponent(slug)}/related/`,
    { auth: false, signal, params: { limit } }
  );
}

/**
 * Hydrate a list of product IDs (order preserved, unknown/inactive dropped).
 * Powers the client-stored "recently viewed" strip. Returns `[]` for no ids.
 */
export function listProductsByIds(
  ids: string[],
  signal?: AbortSignal
): Promise<ProductListItem[]> {
  const cleaned = ids.filter(Boolean);
  if (!cleaned.length) return Promise.resolve([]);
  return apiGet<ProductListItem[]>("/catalog/products/batch/", {
    auth: false,
    signal,
    params: { ids: cleaned.join(",") },
  });
}

export function listCategories(signal?: AbortSignal): Promise<ApiCategory[]> {
  return apiGet<ApiCategory[]>("/catalog/categories/", { auth: false, signal });
}

export function listCollections(
  signal?: AbortSignal
): Promise<ApiCollection[]> {
  return apiGet<ApiCollection[]>("/catalog/collections/", {
    auth: false,
    signal,
  });
}

export function submitReview(input: {
  product_id: string;
  order_item_id: string;
  rating: number;
  title?: string;
  body?: string;
}): Promise<Review> {
  return apiPost<Review>("/catalog/reviews/", input);
}

export interface ReviewPage {
  items: Review[];
  meta: PageMeta;
}

/**
 * Site-wide feed of APPROVED reviews across all products — the homepage
 * carousel and every product page share this one feed rather than a
 * per-product one, so `product` is optional and unused by most callers.
 * Public endpoint, no auth.
 */
export async function listReviews(
  query: { page?: number; page_size?: number; product?: string } = {},
  signal?: AbortSignal
): Promise<ReviewPage> {
  const { data, meta } = await apiGetWithMeta<Review[]>("/catalog/reviews/", {
    auth: false,
    signal,
    params: {
      page: query.page,
      page_size: query.page_size,
      product: query.product,
    },
  });
  const m = (meta as PageMeta) ?? {
    total: data.length,
    page: 1,
    page_size: data.length,
  };
  return { items: data, meta: m };
}

/** Step 1 of the review-photo upload: get a presigned S3 PUT URL. Review
 *  must belong to the calling customer. */
export function presignReviewMedia(
  reviewId: string,
  input: { file_name: string; mime_type: string }
): Promise<ReviewMediaPresign> {
  return apiPost<ReviewMediaPresign>(
    `/catalog/reviews/${reviewId}/media/presign/`,
    input
  );
}

/** Step 2 (PUT the raw file bytes straight to S3) is `uploadToPresignedUrl`
 *  from `./returns` — reused as-is rather than duplicated here. */

/** Step 3: confirm the upload so the backend creates the ReviewImage record. */
export function confirmReviewMedia(
  reviewId: string,
  input: {
    s3_key: string;
    file_name?: string;
    mime_type?: string;
    file_size?: number;
  }
): Promise<ReviewImage> {
  return apiPost<ReviewImage>(
    `/catalog/reviews/${reviewId}/media/confirm/`,
    input
  );
}
