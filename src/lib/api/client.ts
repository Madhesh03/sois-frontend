/**
 * Low-level HTTP client for the SOIS consumer API.
 *
 * Responsibilities:
 *  - prefix requests with `NEXT_PUBLIC_API_BASE_URL`
 *  - attach the customer Bearer token, guest `X-Session-Key`, and optional
 *    `X-Tenant-ID` headers (see backend multi-tenancy docs)
 *  - unwrap the consistent response envelope
 *    (`{ success, data, meta }` / `{ success: false, error|errors }`)
 *  - normalise every failure into a thrown `ApiError`
 *
 * Endpoint modules (auth.ts, catalog.ts, …) call `apiGet/apiPost/…` and deal
 * only in already-unwrapped `data`.
 */
import {
  getAccessToken,
  getSessionKey,
  peekSessionKey,
} from "./session";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
  "http://localhost:8000/api/v1";

const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || "";

export interface ApiErrorShape {
  code: string;
  message: string;
  details?: unknown;
}

/** Thrown for any non-2xx response or transport failure. */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: unknown;
  /** Field-level validation errors, when the backend returned `{errors: {...}}`. */
  readonly fieldErrors?: Record<string, string[]>;

  constructor(
    status: number,
    { code, message, details }: ApiErrorShape,
    fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
    this.fieldErrors = fieldErrors;
  }

  /** First human-readable message, preferring field errors. */
  get firstMessage(): string {
    if (this.fieldErrors) {
      const first = Object.values(this.fieldErrors)[0];
      if (first && first.length) return first[0];
    }
    return this.message;
  }
}

interface RequestOptions {
  /** Query params appended to the URL (undefined/null skipped). */
  params?: Record<string, string | number | boolean | undefined | null>;
  /** Send the guest `X-Session-Key` header (cart endpoints). */
  useSessionKey?: boolean;
  /** Override / add headers. */
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Set false for endpoints that must never carry a stale token. */
  auth?: boolean;
}

function buildUrl(
  path: string,
  params?: RequestOptions["params"]
): string {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
  );
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

function buildHeaders(opts: RequestOptions, hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (hasBody) headers["Content-Type"] = "application/json";

  if (opts.auth !== false) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  if (opts.useSessionKey && !getAccessToken()) {
    headers["X-Session-Key"] = getSessionKey();
  }

  if (TENANT_ID) headers["X-Tenant-ID"] = TENANT_ID;

  return { ...headers, ...(opts.headers ?? {}) };
}

/**
 * The consumer API envelope is not perfectly uniform (see the OpenAPI notes on
 * legacy shapes), so we parse defensively:
 *   success: `{ success:true, data, meta }` or `{ success:true, message }`
 *   error:   `{ success:false, error:{code,message,details} }`
 *            | `{ success:false, error:"string" }`
 *            | `{ success:false, errors:{field:[...]} }`
 */
async function parse<T>(res: Response): Promise<{ data: T; meta?: unknown }> {
  let body: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      body = JSON.parse(text);
    } catch {
      body = text;
    }
  }

  if (res.ok) {
    if (body && typeof body === "object" && "data" in (body as object)) {
      const b = body as { data: T; meta?: unknown };
      return { data: b.data, meta: b.meta };
    }
    // Message-only responses (delete/clear) — return the whole body.
    return { data: body as T };
  }

  // Error path — normalise the various documented shapes.
  if (body && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (b.errors && typeof b.errors === "object") {
      const fieldErrors = b.errors as Record<string, string[]>;
      throw new ApiError(
        res.status,
        {
          code: "ValidationError",
          message: "Validation failed.",
          details: fieldErrors,
        },
        fieldErrors
      );
    }
    if (typeof b.error === "string") {
      throw new ApiError(res.status, {
        code: res.statusText || "Error",
        message: b.error,
      });
    }
    if (b.error && typeof b.error === "object") {
      const e = b.error as ApiErrorShape;
      throw new ApiError(res.status, {
        code: e.code ?? res.statusText,
        message: e.message ?? "Request failed.",
        details: e.details,
      });
    }
  }

  throw new ApiError(res.status, {
    code: res.statusText || "Error",
    message: `Request failed with status ${res.status}.`,
  });
}

async function request<T>(
  method: string,
  path: string,
  bodyData: unknown,
  opts: RequestOptions = {}
): Promise<{ data: T; meta?: unknown }> {
  const hasBody = bodyData !== undefined && method !== "GET";
  let res: Response;
  try {
    res = await fetch(buildUrl(path, opts.params), {
      method,
      headers: buildHeaders(opts, hasBody),
      body: hasBody ? JSON.stringify(bodyData) : undefined,
      signal: opts.signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    throw new ApiError(0, {
      code: "NetworkError",
      message:
        "Could not reach the SOIS API. Check your connection or that the backend is running.",
      details: err instanceof Error ? err.message : String(err),
    });
  }
  return parse<T>(res);
}

// ── Convenience wrappers returning just `data` ──────────────────────────────
export async function apiGet<T>(
  path: string,
  opts?: RequestOptions
): Promise<T> {
  return (await request<T>("GET", path, undefined, opts)).data;
}

/** GET variant that also returns pagination `meta`. */
export async function apiGetWithMeta<T>(
  path: string,
  opts?: RequestOptions
): Promise<{ data: T; meta?: unknown }> {
  return request<T>("GET", path, undefined, opts);
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  opts?: RequestOptions
): Promise<T> {
  return (await request<T>("POST", path, body ?? {}, opts)).data;
}

export async function apiPatch<T>(
  path: string,
  body?: unknown,
  opts?: RequestOptions
): Promise<T> {
  return (await request<T>("PATCH", path, body ?? {}, opts)).data;
}

export async function apiDelete<T>(
  path: string,
  body?: unknown,
  opts?: RequestOptions
): Promise<T> {
  return (await request<T>("DELETE", path, body, opts)).data;
}

export { getSessionKey, peekSessionKey };
