import type { ProductSummary } from "@/types";
import { ProductCard } from "@/components/products/product-card";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-24 text-center">
        <p className="text-sm text-muted-foreground">
          Nie znaleziono produktów spełniających wybrane kryteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
