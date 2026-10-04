import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import { CustomOrderInfo } from "@/components/contact/custom-order-info";
import { ContactForm } from "@/components/contact/contact-form";
import measuringImage from "@/public/assets/backgrounds/background_3.jpeg";

export const metadata: Metadata = {
  title: "Kontakt i zamówienia indywidualne | KS",
  description:
    "Skontaktuj się z KS — odpowiemy na pytania o produkty oraz pomożemy zaprojektować torbę na indywidualne zamówienie.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Kontakt"
        title="Napisz do nas"
        description="Masz pytanie o produkt, zamówienie albo chcesz zaprojektować torbę na zamówienie? Wypełnij formularz — odpowiemy najszybciej, jak możemy."
        className="mb-10"
      />
      <div className="relative mb-12 aspect-[21/9] overflow-hidden rounded-sm">
        <Image
          src={measuringImage}
          alt="Ręczne wyznaczanie wymiarów torby na naturalnej skórze"
          fill
          placeholder="blur"
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="photo-grade object-cover"
        />
      </div>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <CustomOrderInfo />
        <ContactForm />
      </div>
    </div>
  );
}
