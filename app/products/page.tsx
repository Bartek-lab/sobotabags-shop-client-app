import type { Metadata } from "next";
import { getAllProducts, PRICE_BOUNDS } from "@/lib/products";
import { ProductsExplorer } from "@/components/products/products-explorer";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Kolekcja toreb | KS",
  description: "Przeglądaj ręcznie robione skórzane torby damskie i męskie KS.",
};

type CategoryFilter = "women" | "men" | "all";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getAllProducts();

  const initialCategory: CategoryFilter = category === "women" || category === "men" ? category : "all";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Kolekcja"
        title="Wszystkie torby"
        description="Ręcznie szyte torby z naturalnej skóry. Filtruj według kategorii i ceny, by znaleźć swój idealny model."
        className="mb-10"
      />
      <ProductsExplorer products={products} initialCategory={initialCategory} priceBounds={PRICE_BOUNDS} />
    </div>
  );
}
