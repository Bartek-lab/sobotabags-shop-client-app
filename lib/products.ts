import type {
  Category,
  ProductAttribute,
  ProductDetail,
  ProductSummary,
  ProductVariant,
  ProductVariantOption,
  SortOption,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_SHOP_URL;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Najnowsze" },
  { value: "price-asc", label: "Cena: od najniższej" },
  { value: "price-desc", label: "Cena: od najwyższej" },
];

// api-shop returns snake_case JSON (it's a Python/Pydantic API) -- these map
// each response shape to the camelCase types the rest of this app uses.
// Returning `res.json()` straight through would silently produce objects
// with the wrong key names (price_from, not priceFrom), not a type error.

function mapCategory(raw: any): Category {
  return { id: raw.id, code: raw.code, parentId: raw.parent_id, name: raw.name, slug: raw.slug };
}

function mapProductSummary(raw: any): ProductSummary {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.short_description,
    priceFrom: raw.price_from,
    imageUrl: raw.image_url,
    categorySlug: raw.category_slug,
    categoryName: raw.category_name,
  };
}

function mapVariantOption(raw: any): ProductVariantOption {
  return {
    attributeCode: raw.attribute_code,
    attributeName: raw.attribute_name,
    optionCode: raw.option_code,
    optionLabel: raw.option_label,
  };
}

function mapVariant(raw: any): ProductVariant {
  return {
    id: raw.id,
    sku: raw.sku,
    price: raw.price,
    compareAtPrice: raw.compare_at_price,
    available: raw.available,
    lowStock: raw.low_stock,
    options: (raw.options as any[]).map(mapVariantOption),
  };
}

function mapAttribute(raw: any): ProductAttribute {
  return { code: raw.code, name: raw.name, value: raw.value };
}

function mapProductDetail(raw: any): ProductDetail {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.short_description,
    description: raw.description,
    categorySlug: raw.category_slug,
    images: raw.images,
    variants: (raw.variants as any[]).map(mapVariant),
    attributes: (raw.attributes as any[]).map(mapAttribute),
    related: (raw.related as any[]).map(mapProductSummary),
  };
}

export async function getAllCategories(): Promise<Category[]> {
  const res = await fetch(`${API_URL}/categories`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Nie udało się pobrać kategorii (HTTP ${res.status})`);
  const data = await res.json();
  return (data as any[]).map(mapCategory);
}

export interface ProductFilters {
  /** category slug */
  category?: string;
}

export async function getFilteredProducts(
  filters: ProductFilters = {},
  sort: SortOption = "newest"
): Promise<ProductSummary[]> {
  const params = new URLSearchParams();
  if (filters.category) params.set("category", filters.category);
  params.set("sort", sort);

  const res = await fetch(`${API_URL}/products?${params.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Nie udało się pobrać produktów (HTTP ${res.status})`);
  const data = await res.json();
  return (data as any[]).map(mapProductSummary);
}

export async function getAllProducts(): Promise<ProductSummary[]> {
  return getFilteredProducts();
}

// "Featured" isn't backed by any real flag in the schema (see api-shop's own
// comment on this) -- newest-first is the honest stand-in, same choice made
// on the server side for the default sort.
export async function getFeaturedProducts(limit = 4): Promise<ProductSummary[]> {
  const products = await getFilteredProducts({}, "newest");
  return products.slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | undefined> {
  const res = await fetch(`${API_URL}/products/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Nie udało się pobrać produktu (HTTP ${res.status})`);
  return mapProductDetail(await res.json());
}
