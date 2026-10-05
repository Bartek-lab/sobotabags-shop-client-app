"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal } from "lucide-react";

import type { Category, ProductSummary, SortOption } from "@/types";
import { SORT_OPTIONS } from "@/lib/products";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Filtering/sorting happens server-side now (api-shop), not over an
// already-loaded array -- this component only reflects URL search params
// and asks the server page to re-fetch by pushing new ones. No price-range
// filter here: api-shop doesn't support it yet (category + sort only), so
// it's dropped rather than faked client-side over an already-filtered list.
export function ProductsExplorer({
  products,
  categories,
  activeCategory,
  activeSort,
}: {
  products: ProductSummary[];
  categories: Category[];
  activeCategory?: string;
  activeSort: SortOption;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filterPanel = (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Kategoria</h3>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => updateParam("category", undefined)}
          className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
            !activeCategory
              ? "bg-secondary font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          Wszystkie
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParam("category", cat.slug)}
            className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
              activeCategory === cat.slug
                ? "bg-secondary font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
      <aside className="hidden lg:block">{filterPanel}</aside>

      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="outline" size="sm" className="gap-2 lg:hidden">
                  <SlidersHorizontal className="size-3.5" />
                  Filtry
                </Button>
              }
            />
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>Filtry</SheetTitle>
              </SheetHeader>
              <div className="px-4">{filterPanel}</div>
            </SheetContent>
          </Sheet>

          <p className="text-sm text-muted-foreground lg:hidden">{products.length} produktów</p>

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-sm text-muted-foreground sm:block">{products.length} produktów</p>
            <Select value={activeSort} onValueChange={(value) => updateParam("sort", value ?? undefined)}>
              <SelectTrigger size="sm" className="w-44">
                <SelectValue placeholder="Sortuj" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <ProductGrid products={products} />
      </div>
    </div>
  );
}
