import Image from "next/image";
import { SectionHeading } from "@/components/shared/section-heading";
import measuringImage from "@/public/assets/about_me/about_me_2.jpeg";
import cuttingImage from "@/public/assets/about_me/about_me_3.jpeg";

const STEPS = [
  {
    image: measuringImage,
    alt: "Wyznaczanie krojów na naturalnej skórze przy stole krawieckim",
    caption: "Ręczne wyznaczanie krojów, milimetr po milimetrze.",
  },
  {
    image: cuttingImage,
    alt: "Precyzyjne cięcie i pomiar naturalnej skóry",
    caption: "Każdy element mierzę i wycinam osobno, zanim trafi pod igłę.",
  },
];

export function AboutProcess() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <SectionHeading
          eyebrow="Proces"
          title="Jak powstaje torba"
          description="Od kawałka surowej skóry do gotowego, ręcznie wykończonego produktu — bez skrótów i bez pośpiechu."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {STEPS.map((step) => (
            <figure key={step.caption} className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={step.image}
                alt={step.alt}
                fill
                placeholder="blur"
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="photo-grade object-cover"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-5 text-sm leading-snug text-white/90">
                {step.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
