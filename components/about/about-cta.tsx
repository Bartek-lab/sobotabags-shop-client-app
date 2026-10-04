import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutCta() {
  return (
    <section className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          Chcesz torbę uszytą specjalnie dla Ciebie?
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          Napisz do mnie — wspólnie zaprojektujemy torbę skrojoną na Twoje potrzeby, wybraną skórę i budżet.
        </p>
        <Button
          size="lg"
          className="group mt-6"
          render={
            <Link href="/contact">
              Zamów projekt indywidualny
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />
      </div>
    </section>
  );
}
