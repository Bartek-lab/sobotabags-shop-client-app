import { apiShopJson } from "@/lib/api-shop";
import type { Address, AddressInput } from "@/types";

function mapAddress(raw: any): Address {
  return {
    id: raw.id,
    label: raw.label,
    firstName: raw.first_name,
    lastName: raw.last_name,
    company: raw.company,
    vatId: raw.vat_id,
    line1: raw.line1,
    line2: raw.line2,
    city: raw.city,
    region: raw.region,
    postalCode: raw.postal_code,
    countryCode: raw.country_code,
    phone: raw.phone,
    isDefaultShipping: raw.is_default_shipping,
    isDefaultBilling: raw.is_default_billing,
  };
}

function toPayload(input: AddressInput) {
  return {
    label: input.label,
    first_name: input.firstName,
    last_name: input.lastName,
    company: input.company,
    vat_id: input.vatId,
    line1: input.line1,
    line2: input.line2,
    city: input.city,
    region: input.region,
    postal_code: input.postalCode,
    country_code: input.countryCode,
    phone: input.phone,
    is_default_shipping: input.isDefaultShipping,
    is_default_billing: input.isDefaultBilling,
  };
}

export async function getAddresses(): Promise<Address[]> {
  const raw = await apiShopJson<any[]>("/me/addresses");
  return raw.map(mapAddress);
}

export async function createAddress(input: AddressInput): Promise<Address> {
  const raw = await apiShopJson<any>("/me/addresses", {
    method: "POST",
    body: JSON.stringify(toPayload(input)),
  });
  return mapAddress(raw);
}

export async function updateAddress(id: string, input: AddressInput): Promise<Address> {
  const raw = await apiShopJson<any>(`/me/addresses/${id}`, {
    method: "PUT",
    body: JSON.stringify(toPayload(input)),
  });
  return mapAddress(raw);
}

export async function deleteAddress(id: string): Promise<void> {
  await apiShopJson<void>(`/me/addresses/${id}`, { method: "DELETE" });
}
