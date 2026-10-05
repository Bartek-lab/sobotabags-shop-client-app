"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";

import type { CartItem, ProductDetail, ProductVariant } from "@/types";
import { useCartStore } from "@/lib/cart";
import { formatMinorUnits } from "@/lib/utils";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { Button } from "@/components/ui/button";

interface Axis {
  code: string;
  name: string;
  options: { optionCode: string; optionLabel: string }[];
}

// Derives the set of pickable axes (e.g. color, size) and their option
// values by scanning every variant's options -- not hardcoded, since which
// attributes act as variant axes is config-driven per product type.
function deriveAxes(variants: ProductVariant[]): Axis[] {
  const axisMap = new Map<string, { name: string; options: Map<string, string> }>();
  for (const v of variants) {
    for (const o of v.options) {
      if (!axisMap.has(o.attributeCode)) {
        axisMap.set(o.attributeCode, { name: o.attributeName, options: new Map() });
      }
      axisMap.get(o.attributeCode)!.options.set(o.optionCode, o.optionLabel);
    }
  }
  return Array.from(axisMap.entries()).map(([code, { name, options }]) => ({
    code,
    name,
    options: Array.from(options.entries()).map(([optionCode, optionLabel]) => ({
      optionCode,
      optionLabel,
    })),
  }));
}

// Exact match on the full combination -- this does not disable
// individually-incompatible option buttons (e.g. greying out a size that
// doesn't exist in the currently-selected color), it just fails to resolve
// a variant if the combination doesn't exist. Good enough for a small
// catalog; real cross-constraint disabling is a further nicety, not wired
// in this pass.
function resolveVariant(
  variants: ProductVariant[],
  selected: Record<string, string>
): ProductVariant | undefined {
  return variants.find(
    (v) =>
      v.options.length === Object.keys(selected).length &&
      v.options.every((o) => selected[o.attributeCode] === o.optionCode)
  );
}

export function ProductActions({ product }: { product: ProductDetail }) {
  const axes = React.useMemo(() => deriveAxes(product.variants), [product.variants]);

  const [selected, setSelected] = React.useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.variants[0]?.options.forEach((o) => {
      initial[o.attributeCode] = o.optionCode;
    });
    return initial;
  });
  const [quantity, setQuantity] = React.useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const activeVariant = resolveVariant(product.variants, selected);
  const canPurchase = !!activeVariant && activeVariant.available && activeVariant.price != null;

  function buildCartItem(variant: ProductVariant): Omit<CartItem, "quantity"> {
    return {
      variantId: variant.id,
      productSlug: product.slug,
      productName: product.name,
      sku: variant.sku,
      imageUrl: product.images[0] ?? null,
      price: variant.price ?? 0,
      optionsLabel: variant.options.map((o) => o.optionLabel).join(" / "),
    };
  }

  function handleAddToCart() {
    if (!activeVariant) return;
    addItem(buildCartItem(activeVariant), quantity);
    toast.success("Produkt dodany do koszyka", {
      description: `${product.name} (${activeVariant.options.map((o) => o.optionLabel).join(" / ")}) × ${quantity}`,
    });
  }

  function handleBuyNow() {
    if (!activeVariant) return;
    addItem(buildCartItem(activeVariant), quantity);
    router.push("/cart");
  }

  return (
    <div className="space-y-6">
      <p className="text-2xl">
        {activeVariant?.price != null ? formatMinorUnits(activeVariant.price) : "Cena na zapytanie"}
      </p>

      {axes.map((axis) => (
        <div key={axis.code} className="space-y-2">
          <h3 className="text-sm font-medium">{axis.name}</h3>
          <div className="flex flex-wrap gap-2">
            {axis.options.map((opt) => {
              const isActive = selected[axis.code] === opt.optionCode;
              return (
                <button
                  key={opt.optionCode}
                  type="button"
                  onClick={() => setSelected((prev) => ({ ...prev, [axis.code]: opt.optionCode }))}
                  className={`rounded-sm border px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "border-foreground bg-foreground text-background"
                      : "border-border text-foreground hover:border-foreground/50"
                  }`}
                >
                  {opt.optionLabel}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-sm text-muted-foreground">
          {!activeVariant
            ? "Wybierz dostępną kombinację"
            : !activeVariant.available
              ? "Produkt niedostępny"
              : activeVariant.lowStock
                ? "Zostało niewiele sztuk"
                : "Dostępne — wysyłka w 1-2 dni robocze"}
        </span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={!canPurchase}>
          <ShoppingBag className="size-4" />
          Dodaj do koszyka
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1 gap-2"
          onClick={handleBuyNow}
          disabled={!canPurchase}
        >
          <Zap className="size-4" />
          Kup teraz
        </Button>
      </div>
    </div>
  );
}
