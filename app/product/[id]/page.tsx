import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { getAllProducts, getProductById, getRelatedProducts, getCategoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/utils";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductActions } from "@/components/products/product-actions";
import { RelatedProducts } from "@/components/products/related-products";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} | KS`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Strona główna
          </Link>
          <ChevronRight className="size-3" />
          <Link href="/products" className="hover:text-foreground">
            Kolekcja
          </Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground">{product.name}</span>
        </nav>
      </div>

      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <ProductGallery images={product.images} name={product.name} />

        <div className="space-y-8 lg:max-w-md">
          <div className="space-y-3">
            <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
            <h1 className="font-display text-3xl font-medium tracking-tight">{product.name}</h1>
            <p className="text-2xl">{formatPrice(product.price)}</p>
          </div>

          <p className="leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <Badge key={color} variant="outline" className="font-normal">
                {color}
              </Badge>
            ))}
          </div>

          <ProductActions product={product} />

          <Accordion className="border-t border-border pt-2">
            <AccordionItem value="material">
              <AccordionTrigger>Materiał i wykonanie</AccordionTrigger>
              <AccordionContent>{product.material}. Szyte ręcznie w Polsce.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="dostawa">
              <AccordionTrigger>Dostawa</AccordionTrigger>
              <AccordionContent>
                Wysyłka kurierem w 1-2 dni robocze. Darmowa dostawa od 500 zł.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="zwroty">
              <AccordionTrigger>Zwroty</AccordionTrigger>
              <AccordionContent>
                30 dni na bezpłatny zwrot lub wymianę produktu w stanie nienaruszonym.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      <RelatedProducts products={related} />
    </div>
  );
}
