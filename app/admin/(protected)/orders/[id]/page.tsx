import type { Metadata } from "next";
import { OrderDetailView } from "@/components/admin/order-detail-view";

export const metadata: Metadata = {
  title: "Szczegóły zamówienia | Panel administracyjny",
  robots: { index: false, follow: false },
};

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderDetailView id={id} />;
}
