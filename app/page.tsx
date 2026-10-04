import { Hero } from "@/components/home/hero";
import { ValuesSection } from "@/components/home/values-section";
import { CategorySection } from "@/components/home/category-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { AboutTeaser } from "@/components/home/about-teaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ValuesSection />
      <CategorySection />
      <FeaturedProducts />
      <AboutTeaser />
    </>
  );
}
