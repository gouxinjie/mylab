/**
 * HomePage
 * @description 首页，按照设计稿重新实现
 * @author gouxinjie
 * @updated 2026-07-23 项目数据通过服务器组件传递给客户端组件
 */

import Hero from "@/components/business/Hero";
import Services from "@/components/business/Services";
import FeaturedProjects from "@/components/business/FeaturedProjects";
import QuoteSection from "@/components/business/Quote";
import FadeIn from "@/components/commons/FadeIn";
import { projects } from "@/lib/projects";
import { unstable_setRequestLocale } from "next-intl/server";
import { type Locale } from "@/i18n";

/**
 * 首页
 * @description 通过 unstable_setRequestLocale 固定 locale，使 next-intl 在 Server Component 中支持静态渲染
 */
export default function HomePage({
  params: { locale },
}: Readonly<{
  params: { locale: string };
}>) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  unstable_setRequestLocale(locale as Locale);

  return (
    <>
      {/* 英雄区域 */}
      <Hero />

      <FadeIn delay={0.1}>
        {/* 服务区域 */}
        <Services />
      </FadeIn>

      <FadeIn delay={0.2}>
        {/* 精选项目区域：展示前 3 个项目 */}
        <FeaturedProjects limit={3} projects={projects} />
      </FadeIn>

      <FadeIn delay={0.3}>
        {/* 引用与社交区域 */}
        <QuoteSection />
      </FadeIn>
    </>
  );
}
