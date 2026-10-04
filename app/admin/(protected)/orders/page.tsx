import type { Metadata } from "next";
import { OrderTable } from "@/components/admin/order-table";

export const metadata: Metadata = {
  title: "Zamówienia | Panel administracyjny",
  robots: { index: false, follow: false },
};

export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Zamówienia</h1>
        <p className="text-sm text-muted-foreground">Przeglądaj zamówienia i zarządzaj ich statusem.</p>
      </div>
      <OrderTable />
    </div>
  );
}
