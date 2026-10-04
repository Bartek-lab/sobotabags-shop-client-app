import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/types";
import { getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-muted">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover sepia-[.18] saturate-[.85] contrast-[1.03] transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge variant="secondary" className="bg-background/85 backdrop-blur">
            {getCategoryLabel(product.category)}
          </Badge>
        </div>
        <div className="absolute inset-x-3 bottom-3 flex translate-y-2 items-center justify-between rounded-sm bg-background/90 px-3 py-2 text-xs font-medium opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span>Zobacz szczegóły</span>
          <ArrowUpRight className="size-3.5" />
        </div>
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium leading-snug">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
