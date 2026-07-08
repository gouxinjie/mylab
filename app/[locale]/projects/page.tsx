import { Metadata } from "next";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import FadeIn from "@/components/FadeIn";
import { useTranslations } from "next-intl";

/**
 * ProjectsPage
 * @description 全部项目页面
 * @author gouxinjie
 */

export default function ProjectsPage() {
  const t = useTranslations("Projects");

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        {/* Page Header */}
        <FadeIn>
          <div className="mb-10">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <p className="mt-2 text-[var(--color-text-secondary)]">
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
