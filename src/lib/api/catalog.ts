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
