"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";

import type { Product, ProductCategory, SortOption } from "@/types";
import { filterProducts, sortProducts } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type CategoryFilter = ProductCategory | "all";

const CATEGORY_OPTIONS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Wszystkie" },
  { value: "women", label: "Damskie" },
  { value: "men", label: "Męskie" },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Polecane" },
  { value: "newest", label: "Najnowsze" },
  { value: "price-asc", label: "Cena: od najniższej" },
  { value: "price-desc", label: "Cena: od najwyższej" },
];

export function ProductsExplorer({
  products,
  initialCategory,
  priceBounds,
}: {
  products: Product[];
  initialCategory: CategoryFilter;
  priceBounds: { min: number; max: number };
}) {
  const [category, setCategory] = React.useState<CategoryFilter>(initialCategory);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([priceBounds.min, priceBounds.max]);
  const [sort, setSort] = React.useState<SortOption>("featured");

  const filtered = React.useMemo(() => {
    const byFilters = filterProducts(products, {
      category,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
    return sortProducts(byFilters, sort);
  }, [products, category, priceRange, sort]);

  const filterPanel = (
    <div className="space-y-8">
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Kategoria</h3>
        <div className="flex flex-col gap-1.5">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setCategory(option.value)}
              className={`rounded-sm px-2.5 py-1.5 text-left text-sm transition-colors ${
                category === option.value
                  ? "bg-secondary font-medium text-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium">Cena</h3>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={50}
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
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

          <p className="text-sm text-muted-foreground lg:hidden">{filtered.length} produktów</p>

          <div className="ml-auto flex items-center gap-3">
            <p className="hidden text-sm text-muted-foreground sm:block">{filtered.length} produktów</p>
            <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
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

        <ProductGrid products={filtered} />
      </div>
    </div>
  );
}
