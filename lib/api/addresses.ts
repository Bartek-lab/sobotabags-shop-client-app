import { apiShopJson } from "@/lib/api/client";

// Raw wire shape -- exactly what shop-api's AddressOut Pydantic model
// serializes to (see shop-api/app/schemas/address.py). Shape transforms live
// in lib/mappings/addresses.ts.
export interface RawAddress {
  id: string;
  label: string | null;
  first_name: string;
  last_name: string;
  company: string | null;
  vat_id: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postal_code: string;
  country_code: string;
  phone: string | null;
  is_default_shipping: boolean;
  is_default_billing: boolean;
}

export async function fetchAddresses(): Promise<RawAddress[]> {
  return apiShopJson<RawAddress[]>("/me/addresses");
}

export async function postAddress(payload: Record<string, unknown>): Promise<RawAddress> {
  return apiShopJson<RawAddress>("/me/addresses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function putAddress(id: string, payload: Record<string, unknown>): Promise<RawAddress> {
  return apiShopJson<RawAddress>(`/me/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteAddressById(id: string): Promise<void> {
  await apiShopJson<void>(`/me/addresses/${id}`, { method: "DELETE" });
}
