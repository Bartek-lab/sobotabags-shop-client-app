import { fetchMyOrder, fetchMyOrders, postWithdrawal } from "@/lib/api/orders";
import { mapOrderDetail, mapOrderSummary, mapWithdrawal } from "@/lib/mappings/orders";
import type { Order, OrderDetail, OrderStatus, Withdrawal } from "@/types";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  placed: "W realizacji",
  completed: "Zrealizowane",
  cancelled: "Anulowane",
};

export const ORDER_STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline" | "destructive"> = {
  placed: "outline",
  completed: "secondary",
  cancelled: "destructive",
};

export async function getMyOrders(): Promise<Order[]> {
  const raw = await fetchMyOrders();
  return raw.map(mapOrderSummary);
}

export async function getMyOrder(orderId: string): Promise<OrderDetail> {
  const raw = await fetchMyOrder(orderId);
  return mapOrderDetail(raw);
}

export async function submitWithdrawal(orderId: string, reason: string | null): Promise<Withdrawal> {
  const raw = await postWithdrawal(orderId, reason);
  return mapWithdrawal(raw);
}
