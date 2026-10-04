/**
 * Domain types for KSobota.
 *
 * These mirror the shape we expect from the future Supabase schema
 * (tables: products, profiles, orders, order_items) so that swapping
 * the mock data layer in `lib/` for real Supabase queries later requires
 * no changes to components — only to the data-fetching functions.
 *
 * Enum-like unions use English values (matching the DB schema); Polish
 * labels for them live alongside the mock data in `lib/` and are the only
 * thing rendered to users.
 */

export type ProductCategory = "women" | "men";

/**
 * `in_stock` ships from existing stock; `made_to_order` is out of ready
 * stock but can still be handmade to order within `leadTimeDays`;
 * `unavailable` cannot be purchased at all right now.
 */
export type AvailabilityStatus = "in_stock" | "made_to_order" | "unavailable";

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  /** `null` for products that aren't gender-specific (e.g. unisex/accessories). */
  category: ProductCategory | null;
  images: string[];
  colors: string[];
  material: string;
  featured: boolean;
  stock: number;
  availability: AvailabilityStatus;
  /** Only meaningful when `availability` is `made_to_order`. */
  leadTimeDays?: number;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLine extends CartItem {
  product: Product;
}

export type AuthProvider = "mock";

export type UserRole = "customer" | "admin";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  /** Placeholder for a future Supabase `avatar_url` storage path. */
  avatarUrl?: string;
  createdAt: string;
}

export type OrderStatus = "processing" | "shipped" | "completed" | "cancelled";

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";
