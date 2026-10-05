import type { Metadata } from "next";
import Link from "next/link";
import { XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Płatność anulowana | KS",
};

export default function CheckoutCancelPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <div className="flex flex-col items-center gap-4">
        <XCircle className="size-12 text-muted-foreground" strokeWidth={1.5} />
        <SectionHeading
          align="center"
          title="Płatność anulowana"
          description="Nic nie zostało pobrane. Twój koszyk został zachowany."
        />
        <Button render={<Link href="/cart">Wróć do koszyka</Link>} />
      </div>
    </div>
  );
}
