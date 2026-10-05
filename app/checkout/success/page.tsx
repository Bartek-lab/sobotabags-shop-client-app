"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

import { getCheckoutStatus } from "@/lib/checkout";
import { useCartStore } from "@/lib/cart";
import { formatMinorUnits } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";

// The order already exists (created 'pending' before Stripe was ever
// reached), but the webhook that flips it to 'paid' can land a beat after
// Stripe redirects the customer back here -- this polls a few times before
// giving up, rather than assuming the first "pending" response means
// something went wrong.
const POLL_ATTEMPTS = 6;
const POLL_INTERVAL_MS = 1500;

type ViewState =
  | { kind: "loading" }
  | { kind: "paid"; orderNumber: number | null; totalAmount: number | null }
  | { kind: "error"; message: string };

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderNumberParam = searchParams.get("order_number");
  const clear = useCartStore((state) => state.clear);
  const [state, setState] = React.useState<ViewState>({ kind: "loading" });

  React.useEffect(() => {
    // A gift card covered the whole order -- it was already marked paid
    // synchronously when created, no Stripe session or polling involved.
    if (orderNumberParam) {
      clear();
      setState({ kind: "paid", orderNumber: Number(orderNumberParam), totalAmount: null });
      return;
    }

    if (!sessionId) {
      setState({ kind: "error", message: "Brak identyfikatora sesji płatności." });
      return;
    }

    let cancelled = false;

    async function poll() {
      for (let attempt = 0; attempt < POLL_ATTEMPTS; attempt++) {
        try {
          const result = await getCheckoutStatus(sessionId!);
          if (cancelled) return;
          if (result.status === "paid") {
            clear();
            setState({ kind: "paid", orderNumber: result.orderNumber, totalAmount: result.totalAmount });
            return;
          }
        } catch (error) {
          if (cancelled) return;
          setState({
            kind: "error",
            message: error instanceof Error ? error.message : "Nie udało się potwierdzić zamówienia.",
          });
          return;
        }
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
      }
      if (!cancelled) {
        setState({
          kind: "error",
          message: "Płatność się przetwarza. Sprawdź swoją skrzynkę e-mail za chwilę -- potwierdzenie może zająć minutę.",
        });
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, orderNumberParam]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      {state.kind === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 animate-spin text-leather" />
          <SectionHeading align="center" title="Potwierdzamy płatność..." />
        </div>
      )}

      {state.kind === "paid" && (
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="size-12 text-leather" strokeWidth={1.5} />
          <SectionHeading
            align="center"
            title="Dziękujemy za zamówienie!"
            description={
              state.orderNumber
                ? `Numer zamówienia: ${state.orderNumber}${
                    state.totalAmount != null ? ` · ${formatMinorUnits(state.totalAmount)}` : ""
                  }`
                : undefined
            }
          />
          <Button render={<Link href="/account">Zobacz moje konto</Link>} />
        </div>
      )}

      {state.kind === "error" && (
        <div className="flex flex-col items-center gap-4">
          <XCircle className="size-12 text-destructive" strokeWidth={1.5} />
          <SectionHeading align="center" title="Coś poszło nie tak" description={state.message} />
          <Button variant="outline" render={<Link href="/cart">Wróć do koszyka</Link>} />
        </div>
      )}
    </div>
  );
}
