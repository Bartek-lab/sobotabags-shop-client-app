import { apiShopFetch, apiShopJson } from "@/lib/api/client";

// Raw wire shapes -- exactly what shop-api's Pydantic models serialize to
// (see shop-api/app/schemas/checkout.py). Payload/response shape transforms
// live in lib/mappings/checkout.ts.

export interface RawCheckoutSessionOut {
  url: string | null;
  order_number: number | null;
}

export interface RawCheckoutStatusOut {
  status: "paid" | "pending";
  order_number: number | null;
  total_amount: number | null;
}

export interface RawPricingPreviewOut {
  subtotal_amount: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  gift_card_amount: number;
  amount_due: number;
  promo_name: string | null;
  promo_error: string | null;
  gift_card_error: string | null;
}

export async function postCheckoutSession(payload: Record<string, unknown>): Promise<RawCheckoutSessionOut> {
  return apiShopJson<RawCheckoutSessionOut>("/checkout/session", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function fetchCheckoutSessionStatus(sessionId: string): Promise<RawCheckoutStatusOut> {
  const res = await apiShopFetch(`/checkout/session/${sessionId}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Could not confirm order (HTTP ${res.status})`);
  }
  return res.json();
}

export async function postPricingPreview(payload: Record<string, unknown>): Promise<RawPricingPreviewOut> {
  return apiShopJson<RawPricingPreviewOut>("/checkout/preview", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
