import { apiShopFetch } from "@/lib/api/client";

// Raw wire shape -- exactly what shop-api's ShippingMethodOut Pydantic model
// serializes to (see shop-api/app/schemas/shipping.py).
export interface RawShippingMethod {
  id: string;
  code: string;
  carrier_code: string;
  name: string;
  requires_pickup_point: boolean;
  price_amount: number;
  free_above_amount: number | null;
}

export async function fetchShippingMethods(): Promise<RawShippingMethod[]> {
  const res = await apiShopFetch("/shipping-methods");
  if (!res.ok) throw new Error(`Could not load shipping methods (HTTP ${res.status})`);
  return res.json();
}
