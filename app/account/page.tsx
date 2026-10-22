import type { Metadata } from "next";
import { AccountView } from "@/components/account/account-view";
import { SectionHeading } from "@/components/shared/section-heading";

export const metadata: Metadata = {
  title: "Moje konto | KS",
};

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Moje konto" className="mb-10" />
      <AccountView />
    </div>
  );
}
