import type { Order, OrderStatus } from "@/types";

/**
 * Mock order history standing in for a future Supabase `orders` /
 * `order_items` table pair. `getOrdersForCurrentUser` is already async so
 * the account page won't need to change once it queries Supabase instead.
 */

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  processing: "W realizacji",
  shipped: "Wysłane",
  completed: "Zrealizowane",
  cancelled: "Anulowane",
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  processing: "outline",
  shipped: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export const MOCK_ORDERS: Order[] = [
  {
    id: "KS-204815",
    createdAt: "2026-05-30T14:20:00.000Z",
    status: "completed",
    total: 899,
    items: [{ productId: "torebka-wiktoria", productName: "Torebka Wiktoria", quantity: 1, price: 899 }],
    customerName: "Jan Kowalski",
    customerEmail: "jan.kowalski@example.com",
  },
  {
    id: "KS-198327",
    createdAt: "2026-04-11T09:05:00.000Z",
    status: "completed",
    total: 1398,
    items: [
      { productId: "saszetka-bartosz", productName: "Saszetka Bartosz", quantity: 1, price: 299 },
      { productId: "listonoszka-filip", productName: "Listonoszka Filip", quantity: 1, price: 899 },
    ],
    customerName: "Jan Kowalski",
    customerEmail: "jan.kowalski@example.com",
  },
  {
    id: "KS-186502",
    createdAt: "2026-06-18T18:42:00.000Z",
    status: "shipped",
    total: 1499,
    items: [{ productId: "teczka-konrad", productName: "Teczka Konrad", quantity: 1, price: 1499 }],
    customerName: "Jan Kowalski",
    customerEmail: "jan.kowalski@example.com",
  },
  {
    id: "KS-175093",
    createdAt: "2026-06-27T11:12:00.000Z",
    status: "processing",
    total: 1099,
    items: [{ productId: "shopper-zofia", productName: "Shopper Zofia", quantity: 1, price: 1099 }],
    customerName: "Anna Nowak",
    customerEmail: "anna.nowak@example.com",
  },
  {
    id: "KS-163284",
    createdAt: "2026-03-02T16:30:00.000Z",
    status: "cancelled",
    total: 599,
    items: [{ productId: "listonoszka-marta", productName: "Listonoszka Marta", quantity: 1, price: 599 }],
    customerName: "Piotr Wiśniewski",
    customerEmail: "piotr.wisniewski@example.com",
  },
];

export async function getOrdersForCurrentUser(): Promise<Order[]> {
  return MOCK_ORDERS.filter((order) => order.customerEmail === "jan.kowalski@example.com");
}

export async function getAllOrders(): Promise<Order[]> {
  return MOCK_ORDERS;
}
