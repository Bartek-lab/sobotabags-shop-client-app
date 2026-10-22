"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { useRequireAuth } from "@/hooks/use-require-auth";
import { useOrder } from "@/lib/hooks/use-order";
import { ORDER_STATUS_LABEL, ORDER_STATUS_VARIANT } from "@/lib/orders";
import { formatMinorUnits } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/shared/section-heading";

const WITHDRAWAL_STATUS_LABEL: Record<string, string> = {
  submitted: "Zgłoszone",
  acknowledged: "Przyjęte do realizacji",
  refunded: "Środki zwrócone",
  rejected: "Odrzucone",
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso)
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isReady } = useRequireAuth("/login");
  const { order, loading, error, withdraw, withdrawing } = useOrder(id);

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");

  async function handleWithdraw() {
    try {
      await withdraw(reason.trim() || null);
      toast.success("Zgłoszenie odstąpienia od umowy zostało przyjęte.");
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Nie udało się zgłosić odstąpienia od umowy.");
    }
  }

  if (!isReady || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm text-destructive">{error ?? "Nie znaleziono zamówienia."}</p>
      </div>
    );
  }

  const windowExpired = order.status === "placed" && !order.withdrawal && !order.canWithdraw;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/account"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Moje konto
      </Link>

      <SectionHeading
        title={`Zamówienie #${order.number}`}
        description={formatDate(order.createdAt)}
        className="mb-8"
      />

      <div className="mb-6 flex items-center gap-3">
        <Badge variant={ORDER_STATUS_VARIANT[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>
      </div>

      <div className="space-y-4">
        {order.lines.map((line, index) => (
          <div key={index} className="flex gap-4 rounded-sm border border-border p-4">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-sm bg-secondary">
              {line.imageUrl && (
                <Image src={line.imageUrl} alt={line.productName} fill className="object-cover" />
              )}
            </div>
            <div className="flex flex-1 flex-col justify-center">
              <p className="text-sm font-medium">{line.productName}</p>
              {line.variantLabel && <p className="text-xs text-muted-foreground">{line.variantLabel}</p>}
              <p className="text-xs text-muted-foreground">Ilość: {line.quantity}</p>
            </div>
            <p className="self-center text-sm font-medium">{formatMinorUnits(line.totalAmount)}</p>
          </div>
        ))}
      </div>

      <Separator className="my-6" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Produkty</span>
          <span>{formatMinorUnits(order.subtotalAmount)}</span>
        </div>
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-muted-foreground">
            <span>Rabat</span>
            <span>-{formatMinorUnits(order.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-muted-foreground">
          <span>Dostawa{order.shippingMethodName ? ` (${order.shippingMethodName})` : ""}</span>
          <span>{formatMinorUnits(order.shippingAmount)}</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between font-medium">
        <span>Razem</span>
        <span>{formatMinorUnits(order.totalAmount)}</span>
      </div>

      {(order.address || order.pickupPointName) && (
        <>
          <Separator className="my-6" />
          <div className="space-y-1 text-sm text-muted-foreground">
            <h3 className="font-display text-base text-foreground">Dostawa</h3>
            {order.pickupPointName ? (
              <p>Paczkomat: {order.pickupPointName}</p>
            ) : (
              order.address && (
                <>
                  <p>
                    {order.address.firstName} {order.address.lastName}
                  </p>
                  <p>
                    {order.address.line1}
                    {order.address.line2 ? `, ${order.address.line2}` : ""}
                  </p>
                  <p>
                    {order.address.postalCode} {order.address.city}
                  </p>
                </>
              )
            )}
          </div>
        </>
      )}

      <Separator className="my-6" />

      <div className="rounded-sm border border-border p-5">
        <h3 className="mb-3 font-display text-base">Prawo odstąpienia od umowy</h3>

        {order.withdrawal ? (
          <p className="text-sm text-muted-foreground">
            Zgłoszono {formatDate(order.withdrawal.requestedAt)} — status:{" "}
            <strong className="text-foreground">{WITHDRAWAL_STATUS_LABEL[order.withdrawal.status]}</strong>
          </p>
        ) : windowExpired ? (
          <p className="text-sm text-muted-foreground">
            Termin na odstąpienie od tego zamówienia minął. Jeśli mimo to chcesz zwrócić produkt, napisz do nas.
          </p>
        ) : order.canWithdraw ? (
          <>
            <p className="mb-4 text-sm text-muted-foreground">
              Masz prawo odstąpić od tej umowy w terminie 14 dni bez podawania przyczyny. Zobacz{" "}
              <Link href="/regulamin#prawo-odstapienia" className="text-foreground underline underline-offset-4">
                Regulamin
              </Link>
              .
            </p>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger render={<Button variant="outline">Odstąp od umowy</Button>} />
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Odstąp od umowy</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Potwierdzasz odstąpienie od umowy dla zamówienia #{order.number}. Nie musisz podawać przyczyny.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawal-reason">Powód (opcjonalnie)</Label>
                    <Textarea
                      id="withdrawal-reason"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleWithdraw} disabled={withdrawing}>
                    {withdrawing && <Loader2 className="size-4 animate-spin" />}
                    Potwierdź odstąpienie
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Odstąpienie od umowy jest dostępne dla zamówień opłaconych i jeszcze niezrealizowanych.
          </p>
        )}
      </div>
    </div>
  );
}
