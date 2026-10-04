import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/public/assets/backgrounds/background_2.jpeg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary/40">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-leather">
            Rzemiosło · Skóra naturalna · Polska
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Ręcznie robione torby skórzane premium
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            Każda torba powstaje ręcznie, z najwyższej jakości skóry naturalnej. Minimalistyczna forma,
            ponadczasowy charakter i jakość, która towarzyszy na lata.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Button
              size="lg"
              className="group"
              render={
                <Link href="/products">
                  Zobacz kolekcję
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              }
            />
            <Button size="lg" variant="outline" render={<Link href="/o-mnie">Poznaj pracownię</Link>} />
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-sm shadow-2xl shadow-black/10">
            <Image
              src={heroImage}
              alt="Ręczne szycie skórzanego paska w pracowni KS"
              fill
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="photo-grade object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-sm border border-border bg-background p-5 shadow-xl sm:block">
            <p className="font-display text-2xl">100%</p>
            <p className="text-xs text-muted-foreground">ręcznej pracy, od kroju po ostatni ścieg</p>
          </div>
        </div>
      </div>
    </section>
  );
}
