# SOIS Admin Portal — Build Brief (Mock‑first / UI‑only)

> **Paste this whole document to a fresh Claude Code session in a new, empty repo.**
> It is the complete spec for building the **admin/management portal UI** for the
> SOIS sterling‑silver e‑commerce storefront. Read the whole brief before writing
> code, then propose a short plan before implementing.

---

## 0. READ THIS FIRST — scope of *this* task

A real backend (database + API) is **already being built separately, in parallel.**
Your job here is **NOT** to build a database, server, or real API.

**Your job is to build the entire admin portal front‑end and make every flow
work end‑to‑end against MOCK data**, structured so that when the backend is
ready, connecting it is a one‑layer swap.

So, for this task:
- ✅ Build all admin screens and flows (products, inventory, orders, customers, dashboard, login).
- ✅ Every action fully works against an **in‑memory mock data store** (add/edit/delete product, upload image, change stock, update order status, etc.), with the UI updating live.
- ✅ Persist the mock store to **`localStorage`** so changes survive a page refresh (good for demos).
- ✅ Route **all** data access through a **single data‑access module** (the "seam") with **async** functions that simulate the future API 1:1.
- ❌ No database, no Prisma, no real server API routes, no real auth/backend.
- ❌ Don't over‑engineer persistence — mock store + localStorage is the target.

**Why the discipline about the seam:** when the backend lands, the only change
should be replacing the bodies of the data‑access functions with `fetch()` calls.
No component should know whether data came from a mock or a server.

---

## 1. Context — the product & the storefront

**SOIS** is a premium 925 sterling‑silver jewellery **storefront** (customer‑facing)
that already exists in a separate repo. You are building the **admin portal** the
shop owner uses to manage that store. Match the storefront's stack and brand so
the two feel like one product:

- **Next.js 15** (App Router) + **React 19** + **TypeScript 5.7**
- **Tailwind CSS v4** (`@tailwindcss/postcss`)
- **lucide-react** icons, a few **Radix UI** primitives
- Currency is **Indian Rupee (₹)**, formatted `en-IN` (e.g. `₹1,299`)

The **data shapes in §4 are the contract** the parallel backend will implement.
Your mock data must use these exact shapes, so the later swap is seamless.

---

## 2. Goal & scope (features — all working against mocks)

### Product Management
- Add products · Edit products · Remove products (soft/archive preferred)
- Upload product images (multiple, reorder, set primary) — mocked (see §8)
- Manage pricing (price + optional sale/original price)
- Manage availability (published/active + in‑stock)

### Inventory Management
- Update stock quantity (numeric) · Monitor availability (low/out‑of‑stock flags)

### Order Management
- View orders (list + detail) · Update order status (drives the order timeline)
- Manage shipment info (tracking number, courier, estimated delivery)

### Customer Management
- View customer details · View a customer's order history

### Cross‑cutting
- **Mock** admin login gate (see §8) · Dashboard with key counts
- Responsive but **desktop‑first** (admins use laptops/desktops)
- Proper **loading / empty / error** states everywhere (the async seam makes these real)

---

## 3. Architecture (opinionated — use unless you have a strong reason not to)

**A single Next.js 15 App‑Router app, front‑end only.**

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript, React 19 |
| Styling | Tailwind CSS v4 (use the storefront tokens in §7) |
| UI kit | shadcn/ui (Radix + Tailwind) + lucide-react |
| State | React Context or **Zustand** for the admin store |
| **Data layer** | **One module** `src/lib/admin-api.ts` — async functions, the *only* seam to data |
| Mock store | `src/lib/mock-data.ts` — seed arrays + read/write helpers, persisted to `localStorage` |
| Validation | **Zod** schemas for every form/input (reused client‑side; ready for server later) |
| Auth (mock) | Hardcoded admin creds in env; a fake session cookie / localStorage flag; route guard |
| Data fetching in UI | Call `admin-api.ts` functions (they return Promises); use loading/error states |

Layering rule: **Components → `admin-api.ts` → mock store.** No component reads the
mock arrays directly. `admin-api.ts` functions are `async`, return Promises,
simulate ~200–400ms latency, and can randomly/gracefully surface errors so your
loading/error UI is real. Later, each function body becomes a `fetch()` to the
real backend — nothing else changes.

> Keep a `USE_MOCKS = true` flag (env or const) at the top of `admin-api.ts` and a
> `// TODO(backend): replace with fetch(...)` marker on each function, so the swap
> is mechanical.

---

## 4. Data models — the contract (mock data MUST match these)

These are the **exact TypeScript shapes the storefront/backend use.** You may add
fields; do not rename or drop the ones below.

### 4.1 Product
```ts
type CategorySlug = "rings" | "earrings" | "necklaces" | "bracelets" | "anklets" | "gifts";
interface ProductSpec { label: string; value: string }

interface Product {
  id: string;                 // "sois-<slug>"
  slug: string;               // unique, from name
  name: string;
  subtitle: string;           // default "Sterling Silver · 925"
  category: CategorySlug;
  price: number;              // INR integer rupees
  originalPrice: number | null; // only when on sale (> price)
  sku: string;                // "SOIS-NEC-001"
  images: string[];           // ordered; images[0] = primary
  description: string;
  specifications: ProductSpec[];
  silverDetails: string;      // long material copy
  care: string[];             // care bullets
  inStock: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  rating: number;             // 0–5
  reviewCount: number;
  badge: "New" | "Best Seller" | "Sale" | null; // DERIVED, never hand-set
}
```
**Derived rules (replicate exactly):**
- `badge`: `isNew → "New"` else `isBestSeller → "Best Seller"` else `originalPrice != null → "Sale"` else `null`.
- `originalPrice` meaningful only when `> price`, else `null`.
- `id = "sois-" + slug`; `slug` = lowercase name, non‑alphanumerics → `-`, trimmed.
- `subtitle` defaults to `"Sterling Silver · 925"`.
- `sku = "SOIS-" + <3-letter UPPER category code> + "-" + <zero-padded n>` (e.g. `SOIS-RIN-001`); generate on create, keep on edit.
- `specifications` starts with `{Metal:"925 Sterling Silver"}`, `{Finish:"Rhodium-plated · Tarnish-resistant"}` and ends with `{Hallmark:"925 BIS Hallmarked"}`; admin edits the middle rows.

**Fields to ADD for the admin (not yet in the storefront type):**
- `stockQuantity: number` — real inventory count. **`inStock` derives from `stockQuantity > 0`.**
- `status: "draft" | "published" | "archived"` — only `published` would show on the storefront.
- `lowStockThreshold?: number` (default 5) for the low‑stock flag.
- `createdAt`, `updatedAt` (ISO strings).

### 4.2 Category
```ts
interface Category { slug: CategorySlug; name: string; tagline: string; image: string }
```
Six fixed categories (seed them; no category CRUD in v1). Product‑count per category is derived.

### 4.3 Order
```ts
type OrderStatus = "placed" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
interface OrderItem { id: string; name: string; price: number; image: string; quantity: number; size?: string }
interface ShippingInfo { fullName: string; email: string; phone: string; address: string; city: string; state: string; pincode: string }
interface OrderEvent { status: OrderStatus; label: string; date: string | null; done: boolean }
interface Order {
  id: string;                 // "SOIS-2024-000123"
  date: string;               // ISO
  items: OrderItem[];
  shipping: ShippingInfo;
  paymentMethod: string;      // "UPI" | "Card" | "Net Banking" | ...
  subtotal: number; shippingFee: number; total: number;
  status: OrderStatus;
  timeline: OrderEvent[];
  trackingNumber?: string; courier?: string; estimatedDelivery?: string; // ISO
}
```
**Status/timeline rules (replicate):**
- Forward flow: `placed → confirmed → processing → shipped → delivered`; `cancelled` is terminal & separate.
- On status change, rebuild `timeline`: stages up to & including the new status → `done:true` + `date`; later stages → `done:false`, `date:null`. Label for cancelled is `"Cancelled"`.
- Shipment fields (`trackingNumber`, `courier`, `estimatedDelivery`) set when moving to `shipped`.
- Item `price` is a **snapshot** at order time — never recompute from current product price.

### 4.4 Customer (derived from orders)
Storefront user is minimal: `interface AuthUser { name: string; email: string; phone?: string }`.
There's no separate customer list — **derive customers from orders**, keyed by `email`:
```ts
interface Customer {
  id: string; name: string; email: string; phone?: string;
  addresses: ShippingInfo[]; createdAt: string;
  // derived in UI: orderCount, totalSpent, lastOrderDate
}
```
Customer Management shows details + all orders whose `shipping.email` matches.

### 4.5 Mock admin
`interface AdminUser { email: string; name: string; role: "admin" }` — one hardcoded admin (§8).

---

## 5. Data‑access seam (`src/lib/admin-api.ts`)

Every screen calls these **async** functions (they read/write the mock store and
persist to `localStorage`). This list also **mirrors the future REST API 1:1**, so
the backend swap is a body‑only change. Signatures (adjust names as needed):

```ts
// Products / Inventory
listProducts(params?: { search?; category?; status?; sort? }): Promise<Product[]>
getProduct(id: string): Promise<Product | null>
createProduct(input): Promise<Product>          // generates id/slug/sku/default specs/badge/inStock
updateProduct(id, patch): Promise<Product>       // any fields incl. price/originalPrice/status
archiveProduct(id): Promise<void>                // soft delete → status:"archived"
updateStock(id, stockQuantity: number): Promise<Product>  // flips inStock
uploadProductImages(id, files): Promise<string[]> // mock: objectURL/base64 (see §8)
reorderProductImages(id, images: string[]): Promise<Product>

// Categories
listCategories(): Promise<(Category & { productCount: number })[]>

// Orders
listOrders(params?: { status?; search?; from?; to? }): Promise<Order[]>
getOrder(id: string): Promise<Order | null>
updateOrderStatus(id, status: OrderStatus): Promise<Order>       // rebuilds timeline
updateShipment(id, { trackingNumber, courier, estimatedDelivery }): Promise<Order>

// Customers
listCustomers(params?: { search? }): Promise<(Customer & { orderCount; totalSpent; lastOrderDate })[]>
getCustomer(email: string): Promise<{ customer: Customer; orders: Order[] } | null>

// Auth (mock) & stats
login(email, password): Promise<AdminUser>       // checks hardcoded creds
logout(): Promise<void>
getSession(): Promise<AdminUser | null>
getStats(): Promise<{ productCount; lowStockCount; ordersByStatus; revenue; recentOrders }>
```
Map (for whoever wires the backend later): `listProducts → GET /api/products`,
`createProduct → POST /api/products`, `updateProduct → PATCH /api/products/:id`,
`updateStock → PATCH /api/products/:id/stock`, `updateOrderStatus → PATCH
/api/orders/:id/status`, `updateShipment → PATCH /api/orders/:id/shipment`, etc.

---

## 6. Screens & acceptance criteria (all against the mock store)

**Login `/login`** — mock creds from env; on success set a session flag and go to
dashboard; guard every other route (redirect to `/login` when no session); logout works.

**Dashboard `/`** — cards: published product count, low‑stock count, orders needing
action (placed/confirmed/processing), revenue; + recent‑orders table. Cards link to sections.

**Products `/products`** — table/grid: thumbnail, name, category, price (strike‑through
original when on sale), stock, status badge, quick actions. Search + filter (category/status)
+ sort (newest/price/name). "Add product" → form; row → edit.
✅ Creating generates `id/slug/sku/default specs`, appears in list, persists across refresh.

**Product form `/products/new` & `/products/:id`** — fields: name, category (6‑select),
description, price, originalPrice (optional), specifications (repeatable rows), silverDetails,
care (repeatable bullets), stockQuantity, isNew, isBestSeller, status, rating, reviewCount.
Images: upload multiple, drag‑reorder, set primary, remove, live preview (mocked upload §8).
Show a **live derived preview** of `badge`, `inStock`, `sku`.
✅ Zod validation: name/category/description/price required; price ≥ 0; originalPrice (if set) must be `> price` or coerced to null; ≥1 image to publish.

**Inventory `/inventory`** — focused table: product, current stock, threshold, availability.
Inline edit `stockQuantity` (optimistic). Flags: **out of stock** (0, red), **low stock** (≤ threshold, amber).
✅ Editing stock to 0 flips `inStock` false; > 0 flips true; persists.

**Orders `/orders`** — table: id, date, customer name/email, item count, total, status
(color‑coded), payment method. Filter by status; search by id/email; date range. Row → detail.

**Order detail `/orders/:id`** — items (thumb/name/qty/unit/line total), shipping block,
payment method, totals, full timeline. Actions: **change status** (dropdown per flow + Cancel)
→ timeline rebuilds & re‑renders; **edit shipment** (tracking/courier/ETA), surfaced when → shipped.
✅ Status change persists; timeline dates/`done` update per §4.3.

**Customers `/customers`** — table: name, email, phone, orderCount, totalSpent, lastOrderDate.
Search. Row → detail: profile + saved addresses + **order history** (links to order detail).
✅ Customers are derived from orders (no manual creation in v1).

---

## 7. Design system (match the storefront brand)

Exact tokens (from the storefront):
```
bg:#FAFAFA  surface:#F3F4F6  white:#FFFFFF  ink:#0A0A0A  muted:#4B5563  faint:#9CA3AF
silver:#8891A4  forest:#115E59  sage:#D1FAE5  sageDark:#99F6E4  border:#E8E8E8  borderDk:#D1D5DB
```
- **Primary/brand: forest `#115E59`** (buttons, active states, links). Sage `#D1FAE5` for soft fills/badges.
- Font: **Plus Jakarta Sans** (Google Font).
- Currency: ``formatPrice = (v) => `₹${v.toLocaleString("en-IN")}` `` (reuse verbatim).
- Layout: left sidebar nav (Dashboard, Products, Inventory, Orders, Customers), top bar with admin name + logout, tables with subtle `#E8E8E8` borders, rounded‑lg cards, forest primary actions.
- Status colors: placed/confirmed = forest, processing = amber, shipped = blue, delivered = green, cancelled = red; low‑stock = amber; out‑of‑stock = red.

---

## 8. Mock specifics (how to fake the backend cleanly)

- **Mock store:** `src/lib/mock-data.ts` holds seed arrays + get/set helpers; hydrate from
  `localStorage` on load, write back on every mutation. Keys e.g. `sois_admin_products`,
  `sois_admin_orders`. Provide a **"Reset demo data"** action that clears storage and re‑seeds.
- **Async + latency:** `admin-api.ts` functions `await` a small delay (200–400ms) and return
  Promises so loading spinners/skeletons are real. Optionally expose a dev toggle to simulate errors.
- **Mock auth:** compare against `ADMIN_EMAIL` / `ADMIN_PASSWORD` (env, with sensible defaults like
  `admin@sois.in` / `admin123` documented in the README). Store a session flag in a cookie or
  localStorage; guard routes with it. No JWT/crypto needed.
- **Mock image upload:** on file select, read the file to a **base64 data URL** (`FileReader`)
  and store that string in `images[]` — **use base64, not `URL.createObjectURL`**, because blob
  object‑URLs break after a refresh and won't persist in `localStorage`; base64 survives reload.
  Also allow **pasting an image URL** directly. Add a `// TODO(backend): upload to storage, store returned URL`.
  (Real uploads come with the backend.)
- **IDs/SKUs/timeline** are generated in the mock layer using the §4 rules, exactly as the backend will.

---

## 9. Seed data

Seed the **6 categories** (rings, earrings, necklaces, bracelets, anklets, gifts — give each a
name + tagline + image URL) and ~**20 products** across them. Suggested products
(name — category — price₹ — [originalPrice] — flag):

- Rings: Celestial Stack Ring 899 (new); Luminous Signet Ring 1199/1499 (best seller); Twine Wrap Ring 749; Solitaire Halo Ring 1599/1899
- Earrings: Cascade Hoop Earrings 749/999 (best seller); Ethereal Drop Earrings 899/1199; Petite Orbit Studs 599 (new); Lumen Huggie Hoops 699
- Necklaces: Crescent Moon Pendant 1299/1599 (best seller); Twisted Rope Necklace 1499 (new); Solene Layer Chain 1099; Aurora Pearl Drop Necklace 1799/2099
- Bracelets: Starlight Chain Bracelet 1099 (new); Cubic Charm Bracelet 999/1299; Eterna Cuff Bracelet 1399 (best seller)
- Anklets: Seaside Beaded Anklet 649 (new); Petal Charm Anklet 699/899
- Gifts: Everyday Essentials Gift Set 2499/3199 (best seller); Celestial Duo Gift Set 1999 (new)

Give each a `stockQuantity` mix (healthy / low ≤5 / zero to exercise the flags),
`status:"published"`, sensible `rating`/`reviewCount`, and 2–3 placeholder image URLs
(Unsplash jewellery photos or `/public` placeholders). Also seed **~8–12 orders** spread
across all statuses and a few repeat customers (so Orders + Customers screens are populated;
customers derive from these orders).

---

## 10. Deliverables
1. Running Next.js app (admin UI) with `.env.example` (mock admin creds).
2. `src/lib/mock-data.ts` (seed + localStorage persistence) and `src/lib/admin-api.ts` (async seam).
3. All screens in §6 working end‑to‑end against mocks, changes persisting across refresh.
4. Mock login + route protection; "Reset demo data" action.
5. Zod‑validated forms; loading/empty/error states.
6. Mocked image upload (objectURL/base64) + paste‑URL.
7. `README.md`: setup, env vars, run, default admin login, and a **"Connecting the real backend"**
   section explaining that only `admin-api.ts` function bodies change to `fetch()` calls (with the §5 endpoint map).

## 11. Build order (suggested)
1. Scaffold Next.js + Tailwind v4 + shadcn; tokens, app shell (sidebar + topbar).
2. `mock-data.ts` + `admin-api.ts` seam + seed + localStorage.
3. Products: list + create/edit form + mocked image upload + derived‑field preview.
4. Inventory: stock editing + low/out flags.
5. Orders: list + detail + status/shipment editing (timeline rules).
6. Customers: derived list + detail + order history.
7. Mock login + route guard + "Reset demo data".
8. Dashboard stats; polish loading/empty/error states; README.

## 12. Locked decisions (already answered — no need to ask, just build to these)
- **UI kit:** **shadcn/ui** (Radix + Tailwind, copied into the repo, customized to the forest/sage tokens in §7).
- **Persistence:** **`localStorage`** — the mock store survives page refresh; include a "Reset demo data" action.
- **Mock image handling:** **base64 data URLs** (via `FileReader`) stored in `images[]` + allow **paste‑a‑URL**. Do **not** use `URL.createObjectURL` (blob URLs don't survive refresh). See §8.
- **Reviews:** keep **`rating` and `reviewCount` as editable number fields** on the product form for v1. No separate reviews entity/CRUD.

---

### One‑line kickoff you can also paste
> "Build the SOIS admin portal **front‑end only, against mock data**, exactly per this
> brief: Next.js 15 + TypeScript + Tailwind v4 + shadcn, with a single async data‑access
> seam (`src/lib/admin-api.ts`) over a localStorage‑persisted mock store (`src/lib/mock-data.ts`),
> using the data shapes in §4. Every flow (products, inventory, orders, customers, dashboard,
> mock login) must fully work against the mock store and survive refresh. Design it so the
> real backend connects later by only replacing the seam's function bodies with `fetch()`.
> The §12 decisions are already locked (shadcn/ui, localStorage, base64 images, editable
> rating/reviewCount) — don't re‑ask them. Start by proposing a short plan, then implement in the §11 order."
