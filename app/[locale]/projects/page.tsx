/**
 * ProjectsPage
 * @description 全部项目页面
 * @author gouxinjie
 * @updated 2026-07-23 数据通过服务器组件传递，避免客户端捆绑大数据文件
 */

import type { Metadata } from "next";
import FeaturedProjects from "@/components/business/FeaturedProjects";
import FadeIn from "@/components/commons/FadeIn";
import PageBanner from "@/components/commons/PageBanner";
import { projects } from "@/lib/projects";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import styles from "./page.module.scss";

/** 项目页 SEO 元数据 */
export const metadata: Metadata = {
  title: "项目",
  description:
    "精选全栈项目展示，涵盖 Web 应用、AI 工具、开源组件等多个方向。",
  openGraph: {
    title: "项目 | xinjie",
    description: "精选全栈项目展示",
  },
};

export default function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  unstable_setRequestLocale(locale);
  const t = useTranslations("Projects");

  return (
    <div className={styles.projects}>
      <div className="container-custom">
        {/* 页头横幅：复用 PageBanner 通用组件 */}
        <FadeIn>
          <PageBanner bgImage="/images/project-bg.png">
            <div className={styles.content}>
              <span className={styles.label}>{t("label")}</span>
              <h1 className={styles.title}>{t("title")}</h1>
              <p className={styles.subtitle}>{t("subtitle")}</p>
            </div>
          </PageBanner>
        </FadeIn>
      </div>
      <FadeIn delay={0.1}>
        <FeaturedProjects projects={projects} />
      </FadeIn>
    </div>
  );
}
