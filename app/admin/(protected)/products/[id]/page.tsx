import type { Metadata } from "next";
import { ProductEditView } from "@/components/admin/product-edit-view";

export const metadata: Metadata = {
  title: "Edytuj produkt | Panel administracyjny",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductEditView id={id} />;
}
