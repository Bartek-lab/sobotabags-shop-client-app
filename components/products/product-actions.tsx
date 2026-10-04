"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, Zap } from "lucide-react";
import { toast } from "sonner";

import type { Product } from "@/types";
import { useCartStore } from "@/lib/cart";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { Button } from "@/components/ui/button";

function getAvailabilityMessage(product: Product): string {
  switch (product.availability) {
    case "in_stock":
      return "Dostępne — wysyłka w 1-2 dni robocze";
    case "made_to_order":
      return `Na zamówienie — realizacja w ${product.leadTimeDays ?? 5} dni roboczych`;
    case "unavailable":
      return "Produkt niedostępny";
  }
}

export function ProductActions({ product }: { product: Product }) {
  const [quantity, setQuantity] = React.useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const canPurchase = product.availability !== "unavailable";

  function handleAddToCart() {
    addItem(product.id, quantity);
    toast.success("Produkt dodany do koszyka", {
      description: `${product.name} × ${quantity}`,
    });
  }

  function handleBuyNow() {
    addItem(product.id, quantity);
    router.push("/cart");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-sm text-muted-foreground">{getAvailabilityMessage(product)}</span>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button size="lg" className="flex-1 gap-2" onClick={handleAddToCart} disabled={!canPurchase}>
          <ShoppingBag className="size-4" />
          Dodaj do koszyka
        </Button>
        <Button size="lg" variant="outline" className="flex-1 gap-2" onClick={handleBuyNow} disabled={!canPurchase}>
          <Zap className="size-4" />
          Kup teraz
        </Button>
      </div>
    </div>
  );
}
