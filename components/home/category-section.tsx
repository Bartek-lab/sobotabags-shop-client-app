import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import womenImage from "@/public/assets/backgrounds/background_4.jpeg";
import menImage from "@/public/assets/backgrounds/backgroud_1.jpeg";

const CATEGORIES = [
  {
    href: "/products?category=women",
    title: "Torby damskie",
    description: "Klasyka i elegancja na każdą okazję.",
    image: womenImage,
  },
  {
    href: "/products?category=men",
    title: "Torby męskie",
    description: "Teczki i torby na laptopa dla profesjonalistów.",
    image: menImage,
  },
];

export function CategorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-6 sm:grid-cols-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category.title}
            href={category.href}
            className="group relative isolate flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-sm p-8 sm:aspect-[16/10]"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              placeholder="blur"
              sizes="(min-width: 640px) 50vw, 100vw"
              className="photo-grade -z-10 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="text-white">
              <h3 className="font-display text-2xl">{category.title}</h3>
              <p className="mt-1 text-sm text-white/80">{category.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                Odkryj kolekcję
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
