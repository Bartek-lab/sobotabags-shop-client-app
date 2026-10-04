import Image from "next/image";
import portraitImage from "@/public/assets/about_me/about_me_main.jpeg";

export function AboutHero() {
  return (
    <section className="relative">
      <div className="relative h-[62vh] min-h-[420px] max-h-[680px] w-full overflow-hidden">
        <Image
          src={portraitImage}
          alt="Karolina Sobota trzyma odbitą w skórze literę K — sygnet pracowni KS"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="photo-grade object-cover object-[65%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/5" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#f2ece1]">O mnie</p>
            <h1 className="mt-3 font-display text-4xl font-medium leading-[1.05] tracking-tight text-balance text-white sm:text-5xl lg:text-6xl">
              Karolina Sobota
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              Projektantka i rękodzielniczka. Twórczyni KS — pracowni toreb skórzanych szytych ręcznie,
              jedna sztuka na raz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
