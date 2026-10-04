import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getFeaturedProducts } from "@/lib/products";
import { ProductGrid } from "@/components/products/product-grid";
import { SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(4);

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          eyebrow="Wybrane przez nas"
          title="Bestsellery kolekcji"
          description="Modele, które najczęściej trafiają w ręce naszych klientów."
        />
        <Button
          variant="ghost"
          className="group shrink-0"
          render={
            <Link href="/products">
              Zobacz wszystkie
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </div>
      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
