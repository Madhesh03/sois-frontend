/** Customer auth endpoints (`/auth/customer/*`). */
import { apiGet, apiPatch, apiPost } from "./client";
import { setTokens, peekSessionKey, clearSessionKey } from "./session";
import type {
  Customer,
  CustomerAuthResult,
  CustomerRegisterRequest,
} from "./types";

/**
 * Register a new customer. Tokens are returned immediately and persisted here,
 * so no separate login call is needed. A guest session key (if present) is
 * forwarded so the guest cart can be merged afterwards.
 */
export async function register(
  input: CustomerRegisterRequest
): Promise<CustomerAuthResult> {
  const guestKey = peekSessionKey();
  const result = await apiPost<CustomerAuthResult>(
    "/auth/customer/register/",
    { ...input, guest_session_key: input.guest_session_key ?? guestKey ?? undefined },
    { auth: false }
  );
  setTokens(result.tokens);
  return result;
}

export async function login(
  email: string,
  password: string
): Promise<CustomerAuthResult> {
  const result = await apiPost<CustomerAuthResult>(
    "/auth/customer/login/",
    { email, password },
    { auth: false }
  );
  setTokens(result.tokens);
  return result;
}

export function logout() {
  setTokens(null);
  clearSessionKey();
}

export function getProfile(): Promise<Customer> {
  return apiGet<Customer>("/auth/customer/profile/");
}

export function updateProfile(
  patch: Partial<Pick<Customer, "phone" | "first_name" | "last_name">>
): Promise<Customer> {
  return apiPatch<Customer>("/auth/customer/profile/", patch);
}
