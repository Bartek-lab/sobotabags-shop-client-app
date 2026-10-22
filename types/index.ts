/**
 * Domain types for KSobota, mirroring api-shop's actual response shapes
 * (see api-shop/app/routers/catalog.py) -- not a speculative future schema
 * anymore, this is what's really returned over the wire.
 */

export interface Category {
  id: string;
  code: string;
  parentId: string | null;
  name: string;
  slug: string;
}

export interface ProductVariantOption {
  attributeCode: string;
  attributeName: string;
  optionCode: string;
  optionLabel: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  /** Minor units (grosze); null if no price has been set for this variant yet. */
  price: number | null;
  compareAtPrice: number | null;
  available: boolean;
  /** True when in stock but running low (see api-shop's LOW_STOCK_THRESHOLD) -- for "only a few left" urgency messaging. */
  lowStock: boolean;
  options: ProductVariantOption[];
}

export interface ProductAttribute {
  code: string;
  name: string;
  value: string;
}

export interface ProductSummary {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  /** Minor units; the lowest active variant price, for list/grid display. */
  priceFrom: number | null;
  imageUrl: string | null;
  categorySlug: string | null;
  categoryName: string | null;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  categorySlug: string | null;
  images: string[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  related: ProductSummary[];
}

/** Cart items snapshot what they need to render a cart row on their own --
 * no separate "look the variant back up" step required on reload. */
export interface CartItem {
  variantId: string;
  productSlug: string;
  productName: string;
  sku: string;
  imageUrl: string | null;
  /** Minor units, snapshotted at add-to-cart time. */
  price: number;
  /** Display label for the chosen options, e.g. "Czarny / Mini". */
  optionsLabel: string;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  /** Placeholder for a future Supabase `avatar_url` storage path. */
  avatarUrl?: string;
  createdAt: string;
}

export type OrderStatus = "placed" | "completed" | "cancelled";

export interface Order {
  id: string;
  number: number;
  status: OrderStatus;
  paymentStatus: string;
  /** Minor units. */
  totalAmount: number;
  createdAt: string;
  placedAt: string | null;
  itemCount: number;
}

export interface OrderLine {
  productName: string;
  variantLabel: string | null;
  sku: string;
  quantity: number;
  /** Minor units. */
  unitPriceAmount: number;
  /** Minor units. */
  totalAmount: number;
  imageUrl: string | null;
}

export interface OrderAddress {
  firstName: string;
  lastName: string;
  line1: string;
  line2: string | null;
  city: string;
  postalCode: string;
  countryCode: string;
  phone: string | null;
}

export type WithdrawalStatus = "submitted" | "acknowledged" | "refunded" | "rejected";

export interface Withdrawal {
  id: string;
  status: WithdrawalStatus;
  requestedAt: string;
}

export interface OrderDetail {
  id: string;
  number: number;
  status: OrderStatus;
  paymentStatus: string;
  subtotalAmount: number;
  discountAmount: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  createdAt: string;
  placedAt: string | null;
  cancelledAt: string | null;
  shippingMethodName: string | null;
  pickupPointName: string | null;
  address: OrderAddress | null;
  lines: OrderLine[];
  withdrawal: Withdrawal | null;
  /** Server-computed: not already withdrawn, status is 'placed', and within the withdrawal window. */
  canWithdraw: boolean;
}

export type SortOption = "price-asc" | "price-desc" | "newest";

export interface ShippingMethod {
  id: string;
  code: string;
  carrierCode: string;
  name: string;
  /** true for InPost parcel-locker delivery (pick a locker, no street address); false for courier. */
  requiresPickupPoint: boolean;
  /** Minor units. */
  priceAmount: number;
  /** Minor units; null if this method has no free-shipping threshold. */
  freeAboveAmount: number | null;
}

export interface Address {
  id: string;
  label: string | null;
  firstName: string;
  lastName: string;
  company: string | null;
  vatId: string | null;
  line1: string;
  line2: string | null;
  city: string;
  region: string | null;
  postalCode: string;
  countryCode: string;
  phone: string | null;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}

export type AddressInput = Omit<Address, "id">;

export interface PickupPoint {
  pointName: string;
  pointAddress: string | null;
  firstName: string;
  lastName: string;
  phone: string | null;
}
