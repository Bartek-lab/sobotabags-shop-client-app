import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import portraitImage from "@/public/assets/about_me/about_me_4.jpeg";

export function AboutTeaser() {
  return (
    <section className="border-y border-border bg-secondary/30">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="relative order-last lg:order-first">
          <div className="relative aspect-[5/6] overflow-hidden rounded-sm shadow-2xl shadow-black/10">
            <Image
              src={portraitImage}
              alt="Karolina Sobota we własnej pracowni krawieckiej"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="photo-grade object-cover"
            />
          </div>
        </div>

        <div className="max-w-xl space-y-6">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-leather">O mnie</p>
          <h2 className="font-display text-3xl font-medium tracking-tight text-balance sm:text-4xl">
            Za każdą torbą stoi jedna para rąk
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Nazywam się Karolina Sobota. Od lat kroję, szyję i wykańczam torby ręcznie, we własnej,
            niewielkiej pracowni — bez pośpiechu i bez masowej produkcji. Wybieram skórę tak, jak sama
            chciałabym, żeby ktoś wybierał ją dla mnie: uważnie i z szacunkiem do materiału.
          </p>
          <Button
            variant="outline"
            size="lg"
            className="group"
            render={
              <Link href="/o-mnie">
                Poznaj moją historię
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            }
          />
        </div>
      </div>
    </section>
  );
}
