"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";

import type { OrderStatus } from "@/types";
import { useAdminOrdersStore } from "@/lib/admin-orders";
import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_OPTIONS: OrderStatus[] = ["processing", "shipped", "completed", "cancelled"];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function OrderDetailView({ id }: { id: string }) {
  const [mounted, setMounted] = React.useState(false);
  const order = useAdminOrdersStore((state) => state.orders.find((item) => item.id === id));
  const updateStatus = useAdminOrdersStore((state) => state.updateStatus);

  React.useEffect(() => setMounted(true), []);

  async function handleStatusChange(status: OrderStatus) {
    await updateStatus(id, status);
    toast.success("Status zamówienia został zaktualizowany.");
  }

  if (!mounted) {
    return <Skeleton className="h-72 w-full max-w-2xl" />;
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Nie znaleziono zamówienia {id}.</p>
        <Button variant="outline" render={<Link href="/admin/orders" />}>
          Wróć do listy
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <Link
        href="/admin/orders"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Wróć do listy zamówień
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Zamówienie {order.id}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
        </div>
        <Select value={order.status} onValueChange={(value) => handleStatusChange(value as OrderStatus)}>
          <SelectTrigger className="w-44">
            <SelectValue>
              <Badge variant={ORDER_STATUS_VARIANT[order.status]} className="font-normal">
                {ORDER_STATUS_LABEL[order.status]}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((status) => (
              <SelectItem key={status} value={status}>
                {ORDER_STATUS_LABEL[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-sm border border-border p-5">
        <h2 className="mb-3 text-sm font-medium">Klient</h2>
        <p className="text-sm">{order.customerName}</p>
        <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
      </div>

      <div className="rounded-sm border border-border p-5">
        <h2 className="mb-3 text-sm font-medium">Produkty</h2>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.productId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
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
    </div>
  );
}
