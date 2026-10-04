"use client";

import * as React from "react";
import Link from "next/link";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import type { OrderStatus } from "@/types";
import { useAdminOrdersStore } from "@/lib/admin-orders";
import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from "@/lib/orders";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

const STATUS_OPTIONS: OrderStatus[] = ["processing", "shipped", "completed", "cancelled"];

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", year: "numeric" }).format(
    new Date(iso)
  );
}

export function OrderTable() {
  const orders = useAdminOrdersStore((state) => state.orders);
  const updateStatus = useAdminOrdersStore((state) => state.updateStatus);
  const remove = useAdminOrdersStore((state) => state.remove);
  const isLoading = useAdminOrdersStore((state) => state.isLoading);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const sorted = React.useMemo(
    () => [...orders].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
    [orders]
  );

  async function handleStatusChange(id: string, status: OrderStatus) {
    try {
      await updateStatus(id, status);
      toast.success("Status zamówienia został zaktualizowany.");
    } catch {
      toast.error("Nie udało się zaktualizować statusu.");
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await remove(id);
      toast.success(`Usunięto zamówienie ${id}.`);
    } catch {
      toast.error("Nie udało się usunąć zamówienia.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Zamówienie</TableHead>
            <TableHead>Klient</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Suma</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Akcje</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                Brak zamówień.
              </TableCell>
            </TableRow>
          )}
          {sorted.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.id}</TableCell>
              <TableCell>
                <div>
                  <p>{order.customerName}</p>
                  <p className="text-xs text-muted-foreground">{order.customerEmail}</p>
                </div>
              </TableCell>
              <TableCell>{formatDate(order.createdAt)}</TableCell>
              <TableCell>{formatPrice(order.total)}</TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value as OrderStatus)}
                >
                  <SelectTrigger size="sm" className="w-40">
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
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    render={<Link href={`/admin/orders/${order.id}`} aria-label="Szczegóły" />}
                  >
                    <Eye className="size-3.5" />
                  </Button>
                  <DeleteConfirmDialog
                    trigger={
                      <Button variant="ghost" size="icon-sm" aria-label="Usuń">
                        <Trash2 className="size-3.5" />
                      </Button>
                    }
                    title={`Usunąć zamówienie ${order.id}?`}
                    description="Tej operacji nie można cofnąć. Zamówienie zostanie trwale usunięte."
                    isLoading={isLoading && deletingId === order.id}
                    onConfirm={() => handleDelete(order.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
