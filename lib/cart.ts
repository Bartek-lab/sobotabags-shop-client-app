import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

/**
 * Client-side cart state, persisted to localStorage. Keyed by variantId
 * now, not productId -- our schema prices and stocks at the variant level,
 * so "2x Mila" is ambiguous without knowing which color/size. Each item
 * snapshots what it needs to render a cart row on its own (price, image,
 * option labels) rather than re-fetching per variant on every page load.
 *
 * Checkout itself (creating a Stripe Checkout Session and redirecting) lives
 * in lib/checkout.ts, not here -- this store only owns cart contents, not
 * the act of paying for them.
 */

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity }] });
        }
      },
      removeItem: (variantId) => {
        set({ items: get().items.filter((i) => i.variantId !== variantId) });
      },
      setQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.variantId !== variantId) });
          return;
        }
        set({
          items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
        });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "ksobota-cart" }
  )
);

export function useCartCount(): number {
  return useCartStore((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
}
