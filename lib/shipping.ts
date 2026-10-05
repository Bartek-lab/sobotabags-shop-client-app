import { apiShopFetch } from "@/lib/api-shop";
import type { ShippingMethod } from "@/types";

function mapShippingMethod(raw: any): ShippingMethod {
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

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const res = await apiShopFetch("/shipping-methods");
  if (!res.ok) throw new Error(`Could not load shipping methods (HTTP ${res.status})`);
  const raw = await res.json();
  return raw.map(mapShippingMethod);
}
