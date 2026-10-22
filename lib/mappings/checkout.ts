import type { RawCheckoutSessionOut, RawCheckoutStatusOut, RawPricingPreviewOut } from "@/lib/api/checkout";
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

export function toCheckoutSessionPayload(input: CheckoutInput, origin: string) {
  return {
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
  };
}

export function mapCheckoutSessionResult(raw: RawCheckoutSessionOut): CheckoutSessionResult {
  return { url: raw.url, orderNumber: raw.order_number };
}

export function mapCheckoutStatus(raw: RawCheckoutStatusOut): {
  status: "paid" | "pending";
  orderNumber: number | null;
  totalAmount: number | null;
} {
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

export function toPricingPreviewPayload(input: PricingPreviewInput) {
  return {
    items: input.items.map((i) => ({ variant_id: i.variantId, quantity: i.quantity })),
    shipping_method_id: input.shippingMethodId,
    promo_code: input.promoCode || undefined,
    gift_card_code: input.giftCardCode || undefined,
  };
}

export function mapPricingPreview(raw: RawPricingPreviewOut): PricingPreview {
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
