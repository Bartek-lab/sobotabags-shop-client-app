"use client";

import Link from "next/link";

import { formatMinorUnits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Shipping isn't priced here anymore -- which carrier (InPost locker vs.
// Poczta Polska courier) decides the cost, and that choice now happens on
// /checkout, not the cart page. Showing a guessed flat fee here would just
// be a number that doesn't match what Stripe actually charges.
export function CartSummary({ subtotal }: { subtotal: number }) {
  return (
    <div className="space-y-5 rounded-sm border border-border bg-card p-6">
      <h2 className="font-display text-lg">Podsumowanie</h2>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Produkty</span>
          <span>{formatMinorUnits(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Dostawa</span>
          <span>Obliczana w kasie</span>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between font-medium">
        <span>Produkty razem</span>
        <span>{formatMinorUnits(subtotal)}</span>
      </div>
      <Button size="lg" className="w-full" render={<Link href="/checkout">Przejdź do kasy</Link>} />
      <p className="text-center text-xs text-muted-foreground">
        Płatność kartą, BLIK, Apple Pay lub Google Pay -- bezpiecznie przez Stripe.
      </p>
    </div>
  );
}
