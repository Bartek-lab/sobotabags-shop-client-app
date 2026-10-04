import type { Order } from "@/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export function OrderHistory({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">Nie masz jeszcze żadnych zamówień.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-sm border border-border p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">Zamówienie {order.id}</p>
              <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
            </div>
            <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
          </div>
          <ul className="mt-4 space-y-1.5 border-t border-border pt-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {item.productName} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm font-medium">
            <span>Razem</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
