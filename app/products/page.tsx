import type { Metadata } from "next";
import type { SortOption } from "@/types";
import { getAllCategories, getFilteredProducts } from "@/lib/products";
import { ProductsExplorer } from "@/components/products/products-explorer";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Kolekcja toreb | KS",
  description: "Przeglądaj ręcznie robione skórzane torby KS.",
};

const VALID_SORTS: SortOption[] = ["newest", "price-asc", "price-desc"];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const { category, sort } = await searchParams;
  const activeSort: SortOption = VALID_SORTS.includes(sort as SortOption)
    ? (sort as SortOption)
    : "newest";

  const [products, categories] = await Promise.all([
    getFilteredProducts({ category }, activeSort),
    getAllCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Kolekcja"
        title="Wszystkie torby"
        description="Ręcznie szyte torby z naturalnej skóry. Filtruj według kategorii, by znaleźć swój idealny model."
        className="mb-10"
      />
      <ProductsExplorer
        products={products}
        categories={categories}
        activeCategory={category}
        activeSort={activeSort}
      />
    </div>
  );
}
