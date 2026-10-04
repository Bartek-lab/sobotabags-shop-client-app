import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { AboutStory } from "@/components/about/about-story";
import { AboutProcess } from "@/components/about/about-process";
import { AboutValues } from "@/components/about/about-values";
import { AboutCta } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "O mnie – Karolina Sobota | KS",
  description:
    "Poznaj historię Karoliny Sobota, projektantki i rękodzielniczki stojącej za marką KS — ręcznie szytymi torbami skórzanymi z Polski.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      <AboutProcess />
      <AboutValues />
      <AboutCta />
    </>
  );
}
