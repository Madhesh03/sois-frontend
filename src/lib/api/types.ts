/**
 * TypeScript mirrors of the SOIS backend **consumer API** schemas.
 *
 * Source of truth: backend `docs/openapi/consumer-api.yaml`. Keep these in sync
 * with that file — every request/response body here maps 1:1 to a component
 * schema documented there. The UI-facing shapes (see `src/lib/catalog.ts`) are
 * mapped *from* these in `src/lib/api/mappers.ts`.
 */

// ── Enums ──────────────────────────────────────────────────────────────────
export type MetalType =
  | "silver"
  | "gold"
  | "gold_plated"
  | "rose_gold"
  | "antique"
  | "other";

export type ProductStatus = "draft" | "active" | "out_of_stock" | "archived";
export type StockType = "unique" | "quantity";

export type ApiOrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "shipped_back"
  | "received"
  | "inspected"
  | "rejected_inspection"
  | "refund_initiated"
  | "completed";

export type ReturnReason =
  | "damaged"
  | "wrong_item"
  | "not_as_desc"
  | "changed_mind"
  | "other";

export type PaymentStatus =
  | "created"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type ShipmentStatus =
  | "pending"
  | "booked"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

// ── Envelope / meta ────────────────────────────────────────────────────────
export interface PageMeta {
  total: number;
  page: number;
  page_size: number;
}

// ── Auth / Customer ────────────────────────────────────────────────────────
export interface TokenPair {
  access: string;
  refresh: string;
}

export interface Customer {
  id: string;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
}

export interface CustomerAuthResult {
  customer: Customer;
  tokens: TokenPair;
}

export interface CustomerRegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  guest_session_key?: string;
}

// ── Catalog ────────────────────────────────────────────────────────────────
export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  parent: string | null;
  description: string;
  image_key: string;
  is_active: boolean;
  sort_order: number;
  children?: ApiCategory[];
}

export interface ApiCollection {
  id: string;
  name: string;
  slug: string;
  description: string;
  banner_image_key: string;
  is_active: boolean;
  sort_order: number;
}

export interface ProductMedia {
  id: string;
  media_type: "image" | "video" | "certificate";
  s3_key: string;
  file_name: string;
  mime_type: string;
  alt_text: string;
  sort_order: number;
  is_primary: boolean;
  /** Shown in place of the primary image when a shopper hovers the product card. */
  is_hover: boolean;
}

export interface ProductListItem {
  id: string;
  sku: string;
  name: string;
  slug: string;
  category_name: string | null;
  collection_name: string | null;
  price: number;
  discount_percent: number;
  effective_price: number;
  metal_type: MetalType;
  purity: string;
  stock_type: StockType;
  qty: number;
  is_in_stock: boolean;
  available_sizes: string;
  has_sizes: boolean;
  status: ProductStatus;
  is_featured: boolean;
  thumbnail_key: string;
  primary_image: { s3_key: string; alt_text: string } | null;
  hover_image: { s3_key: string; alt_text: string } | null;
  created_at: string;
}

/** Per-size availability row (sized products only). */
export interface SizeStock {
  size: string;
  qty: number;
  is_in_stock: boolean;
}

export interface StoneDetail {
  type: string;
  weight: string;
  quality: string;
  count: number;
}

/** One labelled measurement, e.g. { label: "Chain length", value: "19", unit: "cm" }. */
export interface ProductDimension {
  label: string;
  value: string;
  unit: "mm" | "cm" | "in";
}

export interface ProductDetail {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  category: ApiCategory | null;
  collection: ApiCollection | null;
  price: number;
  discount_percent: number;
  effective_price: number;
  stock_type: StockType;
  qty: number;
  is_in_stock: boolean;
  status: ProductStatus;
  metal_type: MetalType;
  purity: string;
  gross_weight: number | null;
  net_weight: number | null;
  dimensions: ProductDimension[];
  stone_details: StoneDetail[];
  certificate_details: Record<string, unknown>;
  available_sizes: string;
  size_unit: string;
  variant_label: string;
  has_sizes: boolean;
  size_stock: SizeStock[];
  care_instruction: string;
  is_featured: boolean;
  tags: string[];
  thumbnail_key: string;
  media: ProductMedia[];
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product: string;
  rating: number;
  title: string;
  body: string;
  customer_name: string;
  is_approved: boolean;
  created_at: string;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  collection?: string;
  metal_type?: MetalType;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  featured?: boolean;
  ordering?: string;
  page?: number;
  page_size?: number;
}

// ── Cart ───────────────────────────────────────────────────────────────────
export interface CartItem {
  id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  quantity: number;
  unit_price_at_add: number;
  line_total: number;
  selected_size: string;
  added_at: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
  item_count: number;
  updated_at: string;
}

// ── Addresses ──────────────────────────────────────────────────────────────
export interface Address {
  id: string;
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  is_default: boolean;
}

export interface AddressInput {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  is_default?: boolean;
}

export interface CheckoutAddressInput {
  address_id?: string | null;
  shipping_address?: AddressInput;
}

// ── Checkout ───────────────────────────────────────────────────────────────
export interface CheckoutPreviewLineItem {
  product_id: string;
  product_name: string;
  product_sku: string;
  metal_type: MetalType;
  thumbnail_key: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  selected_size: string;
  price_changed: boolean;
}

export interface CheckoutPreview {
  items: CheckoutPreviewLineItem[];
  item_count: number;
  subtotal: string;
  shipping_charge: string;
  total_amount: string;
  shipping_address: Address;
  reservation_ttl_seconds: number;
  currency: string;
}

export interface CheckoutInitiateResult {
  order_id: string;
  order_number: string;
  total_amount: string;
  reservation_ttl: number;
  razorpay_order_id: string;
  razorpay_key_id: string;
  amount_paise: number;
  currency: string;
  branding: {
    primary_color: string;
    company_name: string;
    logo: string;
  };
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
}

// ── Orders ─────────────────────────────────────────────────────────────────
export interface OrderItem {
  id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  metal_type: string;
  purity: string;
  gross_weight: number | null;
  thumbnail_key: string;
  quantity: number;
  selected_size: string;
  unit_price: number;
  discount_percent: number;
  line_total: number;
  is_reviewed: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  status: ApiOrderStatus;
  payment_status: PaymentStatus;
  shipping_address: Address;
  subtotal: number;
  discount_amount: number;
  shipping_charge: number;
  tax_amount: number;
  total_amount: number;
  notes: string;
  razorpay_order_id: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// ── Returns ────────────────────────────────────────────────────────────────
export interface ReturnMedia {
  id: string;
  media_type: "image" | "video";
  s3_key: string;
  file_name: string;
  mime_type: string;
  file_size: number | null;
  uploaded_at: string;
}

export interface Return {
  id: string;
  order_id: string;
  order_number: string;
  status: ReturnStatus;
  reason: ReturnReason;
  customer_note: string;
  staff_note: string;
  rejection_reason: string;
  return_shipment_awb: string;
  return_shipment_courier: string;
  return_tracking_url: string;
  inspection_note: string;
  inspected_at: string | null;
  refund_id: string | null;
  media: ReturnMedia[];
  created_at: string;
  updated_at: string;
}

export interface ReturnMediaPresign {
  presigned_url: string;
  s3_key: string;
  expires_in: number;
}

// ── Wishlist ───────────────────────────────────────────────────────────────
export interface WishlistItem {
  id: string;
  product_id: string;
  product_sku: string;
  product_name: string;
  price_at_add: number;
  thumbnail_key: string;
  added_at: string;
}

// ── Payments ───────────────────────────────────────────────────────────────
export interface Payment {
  id: string;
  order_id: string;
  order_number: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  failure_reason: string;
  created_at: string;
  updated_at: string;
}

// ── Shipping ───────────────────────────────────────────────────────────────
export interface ShipmentEvent {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

export interface TrackingInfo {
  courier: string;
  awb: string;
  status: ShipmentStatus;
  tracking_url: string;
  estimated_delivery: string | null;
  delivered_at: string | null;
  events: ShipmentEvent[];
}

export interface PincodeServiceability {
  pincode: string;
  serviceable: boolean;
  estimated_delivery_days: number | null;
}
