import { fetchShippingMethods } from "@/lib/api/shipping";
import { mapShippingMethod } from "@/lib/mappings/shipping";
import type { ShippingMethod } from "@/types";

export async function getShippingMethods(): Promise<ShippingMethod[]> {
  const raw = await fetchShippingMethods();
  return raw.map(mapShippingMethod);
}
