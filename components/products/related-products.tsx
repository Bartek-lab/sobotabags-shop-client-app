import type { Product } from "@/types";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";

export function RelatedProducts({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading title="Może Cię zainteresować" className="mb-10" />
      <ProductGrid products={products} />
    </section>
  );
}
