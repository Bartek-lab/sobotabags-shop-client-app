import * as React from "react";

import { getPricingPreview, type PricingPreview } from "@/lib/checkout";
import type { CartItem } from "@/types";

export interface UsePricingPreviewInput {
  items: CartItem[];
  shippingMethodId: string | null;
  promoCode: string;
  giftCardCode: string;
}

/**
 * Re-queries the real pricing engine (same logic as the actual checkout,
 * see shop-api's _price_cart) whenever the cart, shipping method, or an
 * *applied* promo/gift-card code changes -- not on every keystroke, since
 * callers only update promoCode/giftCardCode once the customer clicks
 * "Zastosuj". Invalid codes come back as error strings on the preview
 * itself, not a thrown error -- only a genuine request failure sets `error`.
 */
export function usePricingPreview(input: UsePricingPreviewInput) {
  const [pricing, setPricing] = React.useState<PricingPreview | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { items, shippingMethodId, promoCode, giftCardCode } = input;

  React.useEffect(() => {
    if (!shippingMethodId || items.length === 0) return;
    let cancelled = false;
    setLoading(true);
    getPricingPreview({
      items,
      shippingMethodId,
      promoCode: promoCode || undefined,
      giftCardCode: giftCardCode || undefined,
    })
      .then((p) => {
        if (!cancelled) setPricing(p);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Nie udało się obliczyć ceny.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [items, shippingMethodId, promoCode, giftCardCode]);

  return { pricing, loading, error };
}
