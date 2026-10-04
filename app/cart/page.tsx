import type { Metadata } from "next";
import { getAllProducts } from "@/lib/products";
import { CartView } from "@/components/cart/cart-view";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Koszyk | KS",
};

export default async function CartPage() {
  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Koszyk" className="mb-10" />
      <CartView products={products} />
    </div>
  );
}
