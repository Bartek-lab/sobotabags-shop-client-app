"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import type { CartLine, Product } from "@/types";
import { useCartStore } from "@/lib/cart";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function CartView({ products }: { products: Product[] }) {
  const [mounted, setMounted] = React.useState(false);
  const items = useCartStore((state) => state.items);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  React.useEffect(() => setMounted(true), []);

  const lines: CartLine[] = React.useMemo(() => {
    return items
      .map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return product ? { ...item, product } : null;
      })
      .filter((line): line is CartLine => line !== null);
  }, [items, products]);

  const subtotal = lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0);

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

  if (lines.length === 0) {
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
        {lines.map((line) => (
          <CartItemRow
            key={line.productId}
            line={line}
            onQuantityChange={(quantity) => setQuantity(line.productId, quantity)}
            onRemove={() => removeItem(line.productId)}
          />
        ))}
      </div>
      <div className="lg:sticky lg:top-24 lg:self-start">
        <CartSummary subtotal={subtotal} />
      </div>
    </div>
  );
}
