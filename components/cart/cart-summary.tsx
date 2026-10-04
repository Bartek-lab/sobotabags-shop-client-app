"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { formatPrice } from "@/lib/utils";
import { mockCheckout, useCartStore } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 29;

export function CartSummary({ subtotal }: { subtotal: number }) {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const clear = useCartStore((state) => state.clear);
  const router = useRouter();

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  async function handleCheckout() {
    setIsCheckingOut(true);
    try {
      const { orderId } = await mockCheckout();
      clear();
      toast.success("Zamówienie złożone!", {
        description: `Numer zamówienia: ${orderId}. To jest checkout demonstracyjny — bez realnej płatności.`,
      });
      router.push("/account");
    } finally {
      setIsCheckingOut(false);
    }
  }

  return (
    <div className="space-y-5 rounded-sm border border-border bg-card p-6">
      <h2 className="font-display text-lg">Podsumowanie</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Produkty</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Dostawa</span>
          <span>{shipping === 0 ? "Bezpłatna" : formatPrice(shipping)}</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-medium">
        <span>Razem</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Button
        size="lg"
        className="w-full"
        disabled={subtotal === 0 || isCheckingOut}
        onClick={handleCheckout}
      >
        {isCheckingOut && <Loader2 className="size-4 animate-spin" />}
        Przejdź do kasy
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Płatność i dostawa zostaną wdrożone wraz z integracją Stripe.
      </p>
    </div>
  );
}
