"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { AvailabilityStatus, Product, ProductCategory } from "@/types";
import type { ProductInput } from "@/lib/admin-products";
import { CATEGORY_LABEL, AVAILABILITY_LABEL } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CategoryOption = ProductCategory | "none";

const CATEGORY_OPTIONS: { value: CategoryOption; label: string }[] = [
  { value: "women", label: CATEGORY_LABEL.women },
  { value: "men", label: CATEGORY_LABEL.men },
  { value: "none", label: "Uniseks / brak kategorii" },
];

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string }[] = [
  { value: "in_stock", label: AVAILABILITY_LABEL.in_stock },
  { value: "made_to_order", label: AVAILABILITY_LABEL.made_to_order },
  { value: "unavailable", label: AVAILABILITY_LABEL.unavailable },
];

function parseLines(value: string): string[] {
  return value
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function ProductForm({
  product,
  onSubmit,
}: {
  product?: Product;
  onSubmit: (input: ProductInput) => Promise<void>;
}) {
  const router = useRouter();
  const [category, setCategory] = React.useState<CategoryOption>(product?.category ?? "women");
  const [availability, setAvailability] = React.useState<AvailabilityStatus>(product?.availability ?? "in_stock");
  const [featured, setFeatured] = React.useState(product?.featured ?? false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const leadTimeDaysRaw = String(formData.get("leadTimeDays") ?? "").trim();
    const material = String(formData.get("material") ?? "").trim();
    const shortDescription = String(formData.get("shortDescription") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();
    const colors = parseLines(String(formData.get("colors") ?? ""));
    const images = parseLines(String(formData.get("images") ?? ""));

    if (!name || !material || !shortDescription || !description) {
      setError("Wypełnij wszystkie wymagane pola.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Podaj prawidłową cenę.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Podaj prawidłową liczbę dostępnych sztuk.");
      return;
    }
    if (colors.length === 0) {
      setError("Podaj co najmniej jeden kolor.");
      return;
    }
    if (images.length === 0) {
      setError("Podaj co najmniej jeden adres URL zdjęcia.");
      return;
    }

    const leadTimeDays = leadTimeDaysRaw ? Number(leadTimeDaysRaw) : undefined;
    if (availability === "made_to_order" && leadTimeDays != null && (!Number.isInteger(leadTimeDays) || leadTimeDays <= 0)) {
      setError("Czas realizacji musi być dodatnią liczbą dni.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name,
        category: category === "none" ? null : category,
        price,
        material,
        shortDescription,
        description,
        colors,
        images,
        featured,
        stock,
        availability,
        leadTimeDays: availability === "made_to_order" ? leadTimeDays : undefined,
      });
      toast.success(product ? "Produkt został zaktualizowany." : "Produkt został utworzony.");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zapisać produktu.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Nazwa</Label>
          <Input id="name" name="name" defaultValue={product?.name} placeholder="Torebka Wiktoria" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Cena (PLN)</Label>
          <Input id="price" name="price" type="number" min={0} step={1} defaultValue={product?.price} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Kategoria</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as CategoryOption)}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="material">Materiał</Label>
          <Input
            id="material"
            name="material"
            defaultValue={product?.material}
            placeholder="skóra naturalna licowa"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="shortDescription">Krótki opis</Label>
        <Input
          id="shortDescription"
          name="shortDescription"
          defaultValue={product?.shortDescription}
          placeholder="Klasyczna torba na ramię z miękkiej skóry licowej."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Opis</Label>
        <Textarea id="description" name="description" defaultValue={product?.description} rows={5} required />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="colors">Kolory (jeden na linię)</Label>
          <Textarea
            id="colors"
            name="colors"
            defaultValue={product?.colors.join("\n")}
            placeholder={"Czarny\nKoniak"}
            rows={4}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="images">Zdjęcia — adresy URL (jeden na linię)</Label>
          <Textarea
            id="images"
            name="images"
            defaultValue={product?.images.join("\n")}
            placeholder="https://..."
            rows={4}
            required
          />
        </div>
      </div>

      <div className="space-y-4 rounded-sm border border-border p-4">
        <h3 className="text-sm font-medium">Dostępność</h3>
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="availability">Status</Label>
            <Select value={availability} onValueChange={(value) => setAvailability(value as AvailabilityStatus)}>
              <SelectTrigger id="availability" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AVAILABILITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Liczba dostępnych sztuk</Label>
            <Input id="stock" name="stock" type="number" min={0} step={1} defaultValue={product?.stock ?? 0} required />
          </div>
          {availability === "made_to_order" && (
            <div className="space-y-2">
              <Label htmlFor="leadTimeDays">Czas realizacji (dni robocze)</Label>
              <Input
                id="leadTimeDays"
                name="leadTimeDays"
                type="number"
                min={1}
                step={1}
                defaultValue={product?.leadTimeDays ?? 5}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-8">
        <div className="flex items-center gap-3">
          <Switch id="featured" checked={featured} onCheckedChange={setFeatured} />
          <Label htmlFor="featured">Polecany</Label>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {product ? "Zapisz zmiany" : "Utwórz produkt"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSubmitting}>
          Anuluj
        </Button>
      </div>
    </form>
  );
}
