/**
 * Client-side session state for the consumer API: JWT token pair (authenticated
 * customers) and a guest session key (anonymous carts).
 *
 * All storage is `localStorage`, so everything here is a no-op / null on the
 * server. The token pair carries `token_type: customer_access` and is sent as a
 * Bearer header by `client.ts`. The guest session key is sent as `X-Session-Key`
 * so a guest's cart survives across requests, and is passed to
 * register/merge so the guest cart can be adopted after login.
 */
import type { TokenPair } from "./types";

const ACCESS_KEY = "sois_access_token";
const REFRESH_KEY = "sois_refresh_token";
const SESSION_KEY = "sois_session_key";

const isBrowser = () => typeof window !== "undefined";

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: TokenPair | null) {
  if (!isBrowser()) return;
  if (tokens) {
    window.localStorage.setItem(ACCESS_KEY, tokens.access);
    window.localStorage.setItem(REFRESH_KEY, tokens.refresh);
  } else {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}

/**
 * Return the guest session key, generating and persisting one on first use.
 * Used as the `X-Session-Key` header for guest carts. Ignored by the backend
 * once the request is authenticated.
 */
export function getSessionKey(): string {
  if (!isBrowser()) return "";
  let key = window.localStorage.getItem(SESSION_KEY);
  if (!key) {
    key =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(SESSION_KEY, key);
  }
  return key;
}

/** Peek at the stored guest session key without creating one. */
export function peekSessionKey(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function clearSessionKey() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
}
