import type {
  RawOrderAddress,
  RawOrderDetail,
  RawOrderLine,
  RawOrderSummary,
  RawWithdrawal,
} from "@/lib/api/orders";
import type { Order, OrderAddress, OrderDetail, OrderLine, Withdrawal } from "@/types";

export function mapWithdrawal(raw: RawWithdrawal): Withdrawal {
  return { id: raw.id, status: raw.status, requestedAt: raw.requested_at };
}

export function mapOrderSummary(raw: RawOrderSummary): Order {
  return {
    id: raw.id,
    number: raw.number,
    status: raw.status,
    paymentStatus: raw.payment_status,
    totalAmount: raw.total_amount,
    createdAt: raw.created_at,
    placedAt: raw.placed_at,
    itemCount: raw.item_count,
  };
}

function mapOrderLine(raw: RawOrderLine): OrderLine {
  return {
    productName: raw.product_name,
    variantLabel: raw.variant_label,
    sku: raw.sku,
    quantity: raw.quantity,
    unitPriceAmount: raw.unit_price_amount,
    totalAmount: raw.total_amount,
    imageUrl: raw.image_url,
  };
}

function mapOrderAddress(raw: RawOrderAddress): OrderAddress {
  return {
    firstName: raw.first_name,
    lastName: raw.last_name,
    line1: raw.line1,
    line2: raw.line2,
    city: raw.city,
    postalCode: raw.postal_code,
    countryCode: raw.country_code,
    phone: raw.phone,
  };
}

export function mapOrderDetail(raw: RawOrderDetail): OrderDetail {
  return {
    id: raw.id,
    number: raw.number,
    status: raw.status,
    paymentStatus: raw.payment_status,
    subtotalAmount: raw.subtotal_amount,
    discountAmount: raw.discount_amount,
    shippingAmount: raw.shipping_amount,
    taxAmount: raw.tax_amount,
    totalAmount: raw.total_amount,
    createdAt: raw.created_at,
    placedAt: raw.placed_at,
    cancelledAt: raw.cancelled_at,
    shippingMethodName: raw.shipping_method_name,
    pickupPointName: raw.pickup_point?.point_name ?? null,
    address: raw.address ? mapOrderAddress(raw.address) : null,
    lines: raw.lines.map(mapOrderLine),
    withdrawal: raw.withdrawal ? mapWithdrawal(raw.withdrawal) : null,
    canWithdraw: raw.can_withdraw,
  };
}
