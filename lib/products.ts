import { fetchCategories, fetchProductBySlug, fetchProducts } from "@/lib/api/catalog";
import { mapCategory, mapProductDetail, mapProductSummary } from "@/lib/mappings/catalog";
import type { Category, ProductDetail, ProductSummary, SortOption } from "@/types";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Najnowsze" },
  { value: "price-asc", label: "Cena: od najniższej" },
  { value: "price-desc", label: "Cena: od najwyższej" },
];

export async function getAllCategories(): Promise<Category[]> {
  const data = await fetchCategories();
  return data.map(mapCategory);
}

export interface ProductFilters {
  /** category slug */
  category?: string;
  bestseller?: boolean;
}

export async function getFilteredProducts(
  filters: ProductFilters = {},
  sort: SortOption = "newest"
): Promise<ProductSummary[]> {
  const data = await fetchProducts({ category: filters.category, bestseller: filters.bestseller, sort });
  return data.map(mapProductSummary);
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  return getFilteredProducts();
}

// Backed by the "bestseller" product attribute (boolean, product-level) --
// set per-product in the admin panel. Newest-first among bestsellers, same
// default used elsewhere.
export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const products = await getFilteredProducts({ bestseller: true }, "newest");
  return products.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | undefined> {
  const raw = await fetchProductBySlug(slug);
  return raw ? mapProductDetail(raw) : undefined;
}
