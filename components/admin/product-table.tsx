"use client";

import * as React from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { toast } from "sonner";

import { useAdminProductsStore } from "@/lib/admin-products";
import { getCategoryLabel, AVAILABILITY_LABEL, AVAILABILITY_VARIANT } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export function ProductTable() {
  const products = useAdminProductsStore((state) => state.products);
  const remove = useAdminProductsStore((state) => state.remove);
  const isLoading = useAdminProductsStore((state) => state.isLoading);
  const [query, setQuery] = React.useState("");
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter((product) => product.name.toLowerCase().includes(term));
  }, [products, query]);

  async function handleDelete(id: string, name: string) {
    setDeletingId(id);
    try {
      await remove(id);
      toast.success(`Usunięto produkt „${name}”.`);
    } catch {
      toast.error("Nie udało się usunąć produktu.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Szukaj produktów..."
            className="pl-8"
          />
        </div>
        <Button render={<Link href="/admin/products/new" />} className="gap-2">
          <Plus className="size-4" />
          Dodaj produkt
        </Button>
      </div>

      <div className="rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produkt</TableHead>
              <TableHead>Kategoria</TableHead>
              <TableHead>Cena</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Akcje</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  Brak produktów spełniających kryteria.
                </TableCell>
              </TableRow>
            )}
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element -- admin-entered URLs aren't known to next/image ahead of time */}
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{product.material}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getCategoryLabel(product.category)}</Badge>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={AVAILABILITY_VARIANT[product.availability]}>
                      {AVAILABILITY_LABEL[product.availability]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{product.stock} szt.</span>
                    {product.featured && <Badge variant="outline">Polecany</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      render={<Link href={`/admin/products/${product.id}`} aria-label="Edytuj" />}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <DeleteConfirmDialog
                      trigger={
                        <Button variant="ghost" size="icon-sm" aria-label="Usuń">
                          <Trash2 className="size-3.5" />
                        </Button>
                      }
                      title={`Usunąć „${product.name}”?`}
                      description="Tej operacji nie można cofnąć. Produkt zostanie trwale usunięty z katalogu."
                      isLoading={isLoading && deletingId === product.id}
                      onConfirm={() => handleDelete(product.id, product.name)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
