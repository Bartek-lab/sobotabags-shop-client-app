import type { RawAddress } from "@/lib/api/addresses";
import type { Address, AddressInput } from "@/types";

export function mapAddress(raw: RawAddress): Address {
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

export function toAddressPayload(input: AddressInput) {
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
