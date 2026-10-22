import type {
  RawAttributeValue,
  RawCategory,
  RawProductDetail,
  RawProductListItem,
  RawVariant,
  RawVariantOption,
} from "@/lib/api/catalog";
import type {
  Category,
  ProductAttribute,
  ProductDetail,
  ProductSummary,
  ProductVariant,
  ProductVariantOption,
} from "@/types";

// api-shop returns snake_case JSON (it's a Python/Pydantic API) -- these map
// each response shape to the camelCase types the rest of this app uses.
// Returning the raw response straight through would silently produce objects
// with the wrong key names (price_from, not priceFrom), not a type error.

export function mapCategory(raw: RawCategory): Category {
  return { id: raw.id, code: raw.code, parentId: raw.parent_id, name: raw.name, slug: raw.slug };
}

export function mapProductSummary(raw: RawProductListItem): ProductSummary {
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

export function mapVariantOption(raw: RawVariantOption): ProductVariantOption {
  return {
    attributeCode: raw.attribute_code,
    attributeName: raw.attribute_name,
    optionCode: raw.option_code,
    optionLabel: raw.option_label,
  };
}

export function mapVariant(raw: RawVariant): ProductVariant {
  return {
    id: raw.id,
    sku: raw.sku,
    price: raw.price,
    compareAtPrice: raw.compare_at_price,
    available: raw.available,
    lowStock: raw.low_stock,
    options: raw.options.map(mapVariantOption),
  };
}

export function mapAttribute(raw: RawAttributeValue): ProductAttribute {
  return { code: raw.code, name: raw.name, value: raw.value };
}

export function mapProductDetail(raw: RawProductDetail): ProductDetail {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    shortDescription: raw.short_description,
    description: raw.description,
    categorySlug: raw.category_slug,
    images: raw.images,
    variants: raw.variants.map(mapVariant),
    attributes: raw.attributes.map(mapAttribute),
    related: raw.related.map(mapProductSummary),
  };
}
