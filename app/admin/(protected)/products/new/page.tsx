"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useAdminProductsStore } from "@/lib/admin-products";
import { ProductForm } from "@/components/admin/product-form";

export default function NewProductPage() {
  const create = useAdminProductsStore((state) => state.create);

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/products"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Wróć do listy produktów
      </Link>
      <h1 className="font-display text-2xl">Nowy produkt</h1>
      <ProductForm
        onSubmit={async (input) => {
          await create(input);
        }}
      />
    </div>
  );
}
