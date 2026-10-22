import { fetchCheckoutSessionStatus, postCheckoutSession, postPricingPreview } from "@/lib/api/checkout";
import {
  mapCheckoutSessionResult,
  mapCheckoutStatus,
  mapPricingPreview,
  toCheckoutSessionPayload,
  toPricingPreviewPayload,
} from "@/lib/mappings/checkout";
import type {
  CheckoutInput,
  CheckoutSessionResult,
  PricingPreview,
  PricingPreviewInput,
} from "@/lib/mappings/checkout";

export type { CheckoutInput, CheckoutSessionResult, PricingPreview, PricingPreviewInput };

/**
 * Creates a Stripe-hosted Checkout Session and returns its URL for a
 * full-page redirect. Shipping method + address/pickup point are already
 * decided and persisted to the order before this call -- Stripe's page only
 * ever handles payment (card, BLIK, Apple Pay, Google Pay), never shipping,
 * since it has no concept of a Polish parcel locker.
 */
export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutSessionResult> {
  const origin = window.location.origin;
  const raw = await postCheckoutSession(toCheckoutSessionPayload(input, origin));
  return mapCheckoutSessionResult(raw);
}

export async function getCheckoutStatus(
  sessionId: string
): Promise<{ status: "paid" | "pending"; orderNumber: number | null; totalAmount: number | null }> {
  const raw = await fetchCheckoutSessionStatus(sessionId);
  return mapCheckoutStatus(raw);
}

/**
 * Read-only price quote -- runs the exact same pricing logic as the real
 * checkout (shop-api/app/routers/checkout.py's _price_cart), so what's shown
 * here always matches what's actually charged. Invalid promo/gift-card codes
 * come back as error strings on an otherwise-valid quote, not a thrown
 * error, so the rest of the cart total stays visible while the customer
 * fixes the code.
 */
export async function getPricingPreview(input: PricingPreviewInput): Promise<PricingPreview> {
  const raw = await postPricingPreview(toPricingPreviewPayload(input));
  return mapPricingPreview(raw);
}
