import FeaturedProjects from "@/components/business/FeaturedProjects";
import FadeIn from "@/components/commons/FadeIn";
import PageBanner from "@/components/commons/PageBanner";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import styles from "./page.module.scss";

/**
 * ProjectsPage
 * @description 全部项目页面
 * @author gouxinjie
 */

export default function ProjectsPage({ params: { locale } }: { params: { locale: string } }) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
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
        <FeaturedProjects />
      </FadeIn>
    </div>
  );
}
