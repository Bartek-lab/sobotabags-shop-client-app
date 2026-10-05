"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useCartStore } from "@/lib/cart";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// No longer takes a `products` prop: every CartItem snapshots what it needs
// to render itself (name, image, price, chosen options) at add-to-cart
// time, so there's nothing left to cross-reference against a product list.
export function CartView() {
  const [mounted, setMounted] = React.useState(false);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  React.useEffect(() => setMounted(true), []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!mounted) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-border py-24 text-center">
        <ShoppingBag className="size-8 text-muted-foreground" strokeWidth={1.5} />
        <div className="space-y-1">
          <p className="font-medium">Twój koszyk jest pusty</p>
          <p className="text-sm text-muted-foreground">Dodaj produkty z naszej kolekcji, by je tu zobaczyć.</p>
        </div>
        <Button className="mt-2" render={<Link href="/products">Przejdź do kolekcji</Link>} />
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <div>
        {items.map((item) => (
          <CartItemRow
            key={item.variantId}
            item={item}
            onQuantityChange={(quantity) => setQuantity(item.variantId, quantity)}
            onRemove={() => removeItem(item.variantId)}
          />
        ))}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
