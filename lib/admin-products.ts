import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";
import { PRODUCTS } from "@/lib/products";

/**
 * Client-side product catalogue for the admin panel, persisted to
 * localStorage. Stands in for real `products`/`product_variants` mutations
 * against Supabase — `create`/`update`/`remove` are already async so admin
 * components won't need to change once they call real API routes instead.
 */

export type ProductInput = Omit<Product, "id" | "slug" | "createdAt">;

function delay(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function uniqueSlug(base: string, existing: Product[]): string {
  let slug = base || "produkt";
  let suffix = 2;
  while (existing.some((product) => product.slug === slug)) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

interface AdminProductsState {
  products: Product[];
  isLoading: boolean;
  create: (input: ProductInput) => Promise<Product>;
  update: (id: string, input: ProductInput) => Promise<Product>;
  remove: (id: string) => Promise<void>;
  /** Adjusts stock by `delta` (negative to reserve, positive to release). Never below 0. */
  adjustStock: (id: string, delta: number) => void;
}

export const useAdminProductsStore = create<AdminProductsState>()(
  persist(
    (set, get) => ({
      products: PRODUCTS,
      isLoading: false,

      create: async (input) => {
        set({ isLoading: true });
        await delay();
        const slug = uniqueSlug(slugify(input.name), get().products);
        const product: Product = { ...input, id: slug, slug, createdAt: new Date().toISOString() };
        set((state) => ({ products: [product, ...state.products], isLoading: false }));
        return product;
      },

      update: async (id, input) => {
        set({ isLoading: true });
        await delay();
        const products = get().products;
        const index = products.findIndex((product) => product.id === id);
        if (index === -1) {
          set({ isLoading: false });
          throw new Error("Nie znaleziono produktu.");
        }
        const updated: Product = { ...products[index], ...input };
        set({
          products: products.map((product) => (product.id === id ? updated : product)),
          isLoading: false,
        });
        return updated;
      },

      remove: async (id) => {
        set({ isLoading: true });
        await delay();
        set((state) => ({
          products: state.products.filter((product) => product.id !== id),
          isLoading: false,
        }));
      },

      adjustStock: (id, delta) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === id ? { ...product, stock: Math.max(0, product.stock + delta) } : product
          ),
        }));
      },
    }),
    { name: "ksobota-admin-products" }
  )
);
