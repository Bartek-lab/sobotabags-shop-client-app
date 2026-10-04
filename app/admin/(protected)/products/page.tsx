import type { Metadata } from "next";
import { ProductTable } from "@/components/admin/product-table";

export const metadata: Metadata = {
  title: "Produkty | Panel administracyjny",
  robots: { index: false, follow: false },
};

export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl">Produkty</h1>
        <p className="text-sm text-muted-foreground">Zarządzaj katalogiem produktów.</p>
      </div>
      <ProductTable />
    </div>
  );
}
