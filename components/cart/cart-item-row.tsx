import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";

import type { CartItem } from "@/types";
import { formatMinorUnits } from "@/lib/utils";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { Button } from "@/components/ui/button";

export function CartItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex gap-4 border-b border-border py-6 first:pt-0">
      <Link
        href={`/product/${item.productSlug}`}
        className="relative size-24 shrink-0 overflow-hidden rounded-sm bg-muted sm:size-28"
      >
        {item.imageUrl && (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            sizes="120px"
            className="object-cover sepia-[.18] saturate-[.85] contrast-[1.03]"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${item.productSlug}`} className="font-medium hover:underline">
              {item.productName}
            </Link>
            {item.optionsLabel && (
              <p className="text-sm text-muted-foreground">{item.optionsLabel}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 shrink-0"
            onClick={onRemove}
            aria-label="Usuń produkt"
          >
            <X className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <QuantitySelector quantity={item.quantity} onChange={onQuantityChange} />
          <p className="font-medium">{formatMinorUnits(item.price * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
