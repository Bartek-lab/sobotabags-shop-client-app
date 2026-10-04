import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Order, OrderStatus } from "@/types";
import { MOCK_ORDERS } from "@/lib/orders";
import { useAdminProductsStore } from "@/lib/admin-products";

/**
 * Client-side order book for the admin panel, persisted to localStorage.
 * Stands in for real `orders` table mutations against Supabase —
 * `updateStatus`/`remove` are already async so admin components won't need
 * to change once they call real API routes instead.
 *
 * Cancelling (or deleting) an order releases its items' stock back to the
 * product catalogue; reinstating a previously cancelled order reserves it
 * again. This is the "syncing with orders" seam — `useAdminProductsStore`
 * stays the single source of truth for stock.
 */

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function releaseStock(order: Order) {
  const adjustStock = useAdminProductsStore.getState().adjustStock;
  order.items.forEach((item) => adjustStock(item.productId, item.quantity));
}

function reserveStock(order: Order) {
  const adjustStock = useAdminProductsStore.getState().adjustStock;
  order.items.forEach((item) => adjustStock(item.productId, -item.quantity));
}

interface AdminOrdersState {
  orders: Order[];
  isLoading: boolean;
  updateStatus: (id: string, status: OrderStatus) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useAdminOrdersStore = create<AdminOrdersState>()(
  persist(
    (set, get) => ({
      orders: MOCK_ORDERS,
      isLoading: false,

      updateStatus: async (id, status) => {
        set({ isLoading: true });
        await delay();
        const order = get().orders.find((item) => item.id === id);
        if (order && order.status !== status) {
          const wasCancelled = order.status === "cancelled";
          const isNowCancelled = status === "cancelled";
          if (!wasCancelled && isNowCancelled) releaseStock(order);
          else if (wasCancelled && !isNowCancelled) reserveStock(order);
        }
        set({
          orders: get().orders.map((item) => (item.id === id ? { ...item, status } : item)),
          isLoading: false,
        });
      },

      remove: async (id) => {
        set({ isLoading: true });
        await delay();
        const order = get().orders.find((item) => item.id === id);
        if (order && order.status !== "cancelled") releaseStock(order);
        set((state) => ({
          orders: state.orders.filter((item) => item.id !== id),
          isLoading: false,
        }));
      },
    }),
    { name: "ksobota-admin-orders" }
  )
);
