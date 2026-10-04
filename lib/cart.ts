import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

/**
 * Client-side cart state, persisted to localStorage.
 *
 * Later, once Supabase + Stripe are wired up, `checkout()` is the seam where
 * a real call (creating a Stripe Checkout Session from an Edge Function,
 * then redirecting) would replace the mock delay below.
 */

interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, quantity = 1) => {
        const items = get().items;
        const existing = items.find((item) => item.productId === productId);
        if (existing) {
          set({
            items: items.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
            ),
          });
        } else {
          set({ items: [...items, { productId, quantity }] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.productId !== productId) });
      },
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((item) => item.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
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

export async function mockCheckout(): Promise<{ orderId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { orderId: `KS-${Math.floor(100000 + Math.random() * 900000)}` };
}
