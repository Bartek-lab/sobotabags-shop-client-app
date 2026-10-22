import type { RawShippingMethod } from "@/lib/api/shipping";
import type { ShippingMethod } from "@/types";

export function mapShippingMethod(raw: RawShippingMethod): ShippingMethod {
  return {
    id: raw.id,
    code: raw.code,
    carrierCode: raw.carrier_code,
    name: raw.name,
    requiresPickupPoint: raw.requires_pickup_point,
    priceAmount: raw.price_amount,
    freeAboveAmount: raw.free_above_amount,
  };
}
