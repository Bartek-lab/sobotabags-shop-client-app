"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useAdminProductsStore, type ProductInput } from "@/lib/admin-products";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductEditView({ id }: { id: string }) {
  const [mounted, setMounted] = React.useState(false);
  const product = useAdminProductsStore((state) => state.products.find((item) => item.id === id));
  const update = useAdminProductsStore((state) => state.update);

  React.useEffect(() => setMounted(true), []);

  async function handleSubmit(input: ProductInput) {
    await update(id, input);
  }

  if (!mounted) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Nie znaleziono produktu {id}.</p>
        <Button variant="outline" render={<Link href="/admin/products" />}>
          Wróć do listy
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link
        href="/admin/products"
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-4" />
        Wróć do listy produktów
      </Link>
      <h1 className="font-display text-2xl">Edytuj produkt</h1>
      <ProductForm product={product} onSubmit={handleSubmit} />
    </div>
  );
}
