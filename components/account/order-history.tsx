import Link from "next/link";
import type { Order } from "@/types";
import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from "@/lib/orders";
import { formatMinorUnits } from "@/lib/utils";
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
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-sm border border-border p-5 transition-colors hover:bg-secondary/40"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium">Zamówienie #{order.number}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(order.createdAt)} · {order.itemCount} {order.itemCount === 1 ? "produkt" : "produkty"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">{formatMinorUnits(order.totalAmount)}</span>
              <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
