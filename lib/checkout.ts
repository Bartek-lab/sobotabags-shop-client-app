import { apiShopFetch, apiShopJson } from "@/lib/api-shop";
import type { Address, CartItem, PickupPoint } from "@/types";

export interface CheckoutInput {
  items: CartItem[];
  shippingMethodId: string;
  /** Required for guests; ignored server-side when a customer is logged in. */
  email?: string;
  address?: Address | Omit<Address, "id">;
  pickupPoint?: PickupPoint;
  promoCode?: string;
  giftCardCode?: string;
}

export interface CheckoutSessionResult {
  /** Null only for a zero-dollar order (gift card covered everything) -- no Stripe redirect needed. */
  url: string | null;
  orderNumber: number | null;
}

/**
 * Creates a Stripe-hosted Checkout Session and returns its URL for a
 * full-page redirect. Shipping method + address/pickup point are already
 * decided and persisted to the order before this call -- Stripe's page only
 * ever handles payment (card, BLIK, Apple Pay, Google Pay), never shipping,
 * since it has no concept of a Polish parcel locker.
 */
export async function createCheckoutSession(input: CheckoutInput): Promise<CheckoutSessionResult> {
  const origin = window.location.origin;
  const raw = await apiShopJson<{ url: string | null; order_number: number | null }>("/checkout/session", {
    method: "POST",
    body: JSON.stringify({
      items: input.items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      shipping_method_id: input.shippingMethodId,
      email: input.email,
      address: input.address
        ? {
            first_name: input.address.firstName,
            last_name: input.address.lastName,
            company: input.address.company,
            line1: input.address.line1,
            line2: input.address.line2,
            city: input.address.city,
            region: input.address.region,
            postal_code: input.address.postalCode,
            country_code: input.address.countryCode,
            phone: input.address.phone,
          }
        : undefined,
      pickup_point: input.pickupPoint
        ? {
            point_name: input.pickupPoint.pointName,
            point_address: input.pickupPoint.pointAddress,
            first_name: input.pickupPoint.firstName,
            last_name: input.pickupPoint.lastName,
            phone: input.pickupPoint.phone,
          }
        : undefined,
      promo_code: input.promoCode || undefined,
      gift_card_code: input.giftCardCode || undefined,
      success_url: `${origin}/checkout/success`,
      cancel_url: `${origin}/checkout/cancel`,
    }),
  });
  return { url: raw.url, orderNumber: raw.order_number };
}

export async function getCheckoutStatus(
  sessionId: string
): Promise<{ status: "paid" | "pending"; orderNumber: number | null; totalAmount: number | null }> {
  const res = await apiShopFetch(`/checkout/session/${sessionId}`);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Could not confirm order (HTTP ${res.status})`);
  }
  const raw = await res.json();
  return { status: raw.status, orderNumber: raw.order_number, totalAmount: raw.total_amount };
}

export interface PricingPreviewInput {
  items: CartItem[];
  shippingMethodId: string;
  promoCode?: string;
  giftCardCode?: string;
}

export interface PricingPreview {
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  giftCardAmount: number;
  amountDue: number;
  promoName: string | null;
  promoError: string | null;
  giftCardError: string | null;
}

/**
 * Read-only price quote -- runs the exact same pricing logic as the real
 * checkout (api-shop/app/routers/checkout.py's _price_cart), so what's shown
 * here always matches what's actually charged. Invalid promo/gift-card codes
 * come back as error strings on an otherwise-valid quote, not a thrown
 * error, so the rest of the cart total stays visible while the customer
 * fixes the code.
 */
export async function getPricingPreview(input: PricingPreviewInput): Promise<PricingPreview> {
  const raw = await apiShopJson<{
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
  }>("/checkout/preview", {
    method: "POST",
    body: JSON.stringify({
      items: input.items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
      shipping_method_id: input.shippingMethodId,
      promo_code: input.promoCode || undefined,
      gift_card_code: input.giftCardCode || undefined,
    }),
  });
  return {
    subtotalAmount: raw.subtotal_amount,
    discountAmount: raw.discount_amount,
    shippingAmount: raw.shipping_amount,
    taxAmount: raw.tax_amount,
    totalAmount: raw.total_amount,
    giftCardAmount: raw.gift_card_amount,
    amountDue: raw.amount_due,
    promoName: raw.promo_name,
    promoError: raw.promo_error,
    giftCardError: raw.gift_card_error,
  };
}
