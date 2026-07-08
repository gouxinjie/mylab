import { Metadata } from "next";
import FeaturedProjects from "@/components/business/FeaturedProjects";
import FadeIn from "@/components/commons/FadeIn";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

/**
 * ProjectsPage
 * @description 全部项目页面
 * @author gouxinjie
 */

export default function ProjectsPage() {
  const t = useTranslations("Projects");

  return (
    <div className={styles.projects}>
      <div className="container-custom">
        {/* Page Header */}
        <FadeIn>
          <div className={styles.header}>
            <h1 className={styles.header__title}>{t("title")}</h1>
            <p className={styles.header__subtitle}>
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <FeaturedProjects />
        </FadeIn>
      </div>
    </div>
  );
}
