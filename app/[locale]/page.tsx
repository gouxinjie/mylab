import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import QuoteSection from "@/components/sections/Quote";
import FadeIn from "@/components/FadeIn";

/**
 * HomePage
 * @description 首页，按照设计稿重新实现
 * @author gouxinjie
 * @updated 2024-07-08
 */

export default function HomePage() {
  return (
    <>
      <Hero />
      
      <FadeIn delay={0.1}>
        <Services />
      </FadeIn>
      
      <FadeIn delay={0.2}>
        <FeaturedProjects />
      </FadeIn>
      
      <FadeIn delay={0.3}>
        <QuoteSection />
      </FadeIn>
    </>
  );
}
