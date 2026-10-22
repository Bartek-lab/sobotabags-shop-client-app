import { apiShopJson } from "@/lib/api/client";

// Raw wire shapes -- exactly what shop-api's Pydantic models serialize to
// (see shop-api/app/schemas/order.py).

export interface RawOrderLine {
  product_name: string;
  variant_label: string | null;
  sku: string;
  quantity: number;
  unit_price_amount: number;
  total_amount: number;
  image_url: string | null;
}

export interface RawOrderAddress {
  first_name: string;
  last_name: string;
  line1: string;
  line2: string | null;
  city: string;
  postal_code: string;
  country_code: string;
  phone: string | null;
}

export interface RawWithdrawal {
  id: string;
  status: "submitted" | "acknowledged" | "refunded" | "rejected";
  requested_at: string;
}

export interface RawOrderSummary {
  id: string;
  number: number;
  status: "placed" | "completed" | "cancelled";
  payment_status: string;
  total_amount: number;
  created_at: string;
  placed_at: string | null;
  item_count: number;
}

export interface RawOrderDetail {
  id: string;
  number: number;
  status: "placed" | "completed" | "cancelled";
  payment_status: string;
  subtotal_amount: number;
  discount_amount: number;
  shipping_amount: number;
  tax_amount: number;
  total_amount: number;
  created_at: string;
  placed_at: string | null;
  cancelled_at: string | null;
  shipping_method_name: string | null;
  pickup_point: { point_name: string; point_address: string | null } | null;
  address: RawOrderAddress | null;
  lines: RawOrderLine[];
  withdrawal: RawWithdrawal | null;
  can_withdraw: boolean;
}

export async function fetchMyOrders(): Promise<RawOrderSummary[]> {
  return apiShopJson<RawOrderSummary[]>("/me/orders");
}

export async function fetchMyOrder(orderId: string): Promise<RawOrderDetail> {
  return apiShopJson<RawOrderDetail>(`/me/orders/${orderId}`);
}

export async function postWithdrawal(orderId: string, reason: string | null): Promise<RawWithdrawal> {
  return apiShopJson<RawWithdrawal>(`/me/orders/${orderId}/withdrawal`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}
