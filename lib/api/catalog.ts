import { publicFetch } from "@/lib/api/client";
import type { SortOption } from "@/types";

// Raw wire shapes -- exactly what shop-api's Pydantic models serialize to
// (see shop-api/app/schemas/catalog.py). No shape transformation here, see
// lib/mappings/catalog.ts for snake_case -> camelCase.

export interface RawCategory {
  id: string;
  code: string;
  parent_id: string | null;
  name: string;
  slug: string;
}

export interface RawProductListItem {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  price_from: number | null;
  image_url: string | null;
  category_slug: string | null;
  category_name: string | null;
}

export interface RawVariantOption {
  attribute_code: string;
  attribute_name: string;
  option_code: string;
  option_label: string;
}

export interface RawVariant {
  id: string;
  sku: string;
  price: number | null;
  compare_at_price: number | null;
  available: boolean;
  low_stock: boolean;
  options: RawVariantOption[];
}

export interface RawAttributeValue {
  code: string;
  name: string;
  value: string;
}

export interface RawProductDetail {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  description: string | null;
  category_slug: string | null;
  images: string[];
  variants: RawVariant[];
  attributes: RawAttributeValue[];
  related: RawProductListItem[];
}

export async function fetchCategories(): Promise<RawCategory[]> {
  const res = await publicFetch("/categories", { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Nie udało się pobrać kategorii (HTTP ${res.status})`);
  return res.json();
}

export interface ProductListParams {
  category?: string;
  bestseller?: boolean;
  sort: SortOption;
}

export async function fetchProducts(params: ProductListParams): Promise<RawProductListItem[]> {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.bestseller) query.set("bestseller", "true");
  query.set("sort", params.sort);

  const res = await publicFetch(`/products?${query.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Nie udało się pobrać produktów (HTTP ${res.status})`);
  return res.json();
}

export async function fetchProductBySlug(slug: string): Promise<RawProductDetail | undefined> {
  const res = await publicFetch(`/products/${slug}`, { next: { revalidate: 60 } });
  if (res.status === 404) return undefined;
  if (!res.ok) throw new Error(`Nie udało się pobrać produktu (HTTP ${res.status})`);
  return res.json();
}
