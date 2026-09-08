/** Customer address book endpoints (`/orders/addresses/*`). Auth required. */
import { apiDelete, apiGet, apiPatch, apiPost } from "./client";
import type { Address, AddressInput } from "./types";

export function listAddresses(): Promise<Address[]> {
  return apiGet<Address[]>("/orders/addresses/");
}

export function createAddress(input: AddressInput): Promise<Address> {
  return apiPost<Address>("/orders/addresses/", input);
}

export function updateAddress(
  id: string,
  input: Partial<AddressInput>
): Promise<Address> {
  return apiPatch<Address>(`/orders/addresses/${id}/`, input);
}

export function deleteAddress(
  id: string
): Promise<{ success: boolean; message: string }> {
  return apiDelete(`/orders/addresses/${id}/`);
}
