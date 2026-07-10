import Hero from "@/components/business/Hero";
import Services from "@/components/business/Services";
import FeaturedProjects from "@/components/business/FeaturedProjects";
import QuoteSection from "@/components/business/Quote";
import BlogEntry from "@/components/business/BlogEntry";
import SkillsSection from "@/components/business/Skills";
import Stats from "@/components/business/Stats";
import FadeIn from "@/components/commons/FadeIn";

/**
 * HomePage
 * @description 首页，按照设计稿重新实现
 * @author gouxinjie
 * @updated 2024-07-08
 */

export default function HomePage() {
  return (
    <>
      {/* 英雄区域 */}
      <Hero />
      
      <FadeIn delay={0.1}>
        {/* 服务区域 */}
        <Services />
      </FadeIn>
      
      <FadeIn delay={0.2}>
        {/* 精选项目区域 */}
        <FeaturedProjects limit={3} />
      </FadeIn>
      
      <FadeIn delay={0.3}>
        {/* 引用与社交区域 */}
        <QuoteSection />
      </FadeIn>
    </>
  );
}
