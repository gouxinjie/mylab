import { Metadata } from "next";
import { experiences, skills } from "@/lib/data";
import GitHubDashboard from "@/components/sections/GitHubDashboard";
import FadeIn from "@/components/FadeIn";
import { useTranslations, useLocale } from "next-intl";

/**
 * AboutPage
 * @description 关于我页面，展示个人简介、技术栈和工作经历
 * @author gouxinjie
 */

export default function AboutPage() {
  const t = useTranslations("About");
  const locale = useLocale();

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <FadeIn>
          <div className="mb-10">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
          </div>
        </FadeIn>

        {/* Bio */}
        <FadeIn delay={0.1}>
          <section className="mb-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 sm:p-8">
            <h2 className="text-xl font-bold mb-4">{t("bio_title")}</h2>
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              {t("bio_1")}
            </p>
            <br />
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              {t("bio_2")}
            </p>
            <br />
            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              {t("bio_3")}
            </p>
          </section>
        </FadeIn>

        {/* Skills */}
        <FadeIn delay={0.2}>
          <section className="mb-12">
            <h2 className="section-title mb-6">{t("skills_title")}</h2>
            <div className="flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Experience Timeline */}
        <FadeIn delay={0.3}>
          <section className="mb-12">
            <h2 className="section-title mb-6">{t("experience_title")}</h2>
            <div className="relative space-y-0 before:absolute before:left-3.5 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--color-border)]">
              {experiences.map((exp, idx) => (
                <FadeIn key={exp.id} delay={0.1 * idx}>
                  <div className="relative pb-8 pl-10">
                    <span
                      className={`absolute left-2 top-1 h-3 w-3 rounded-full border-2 ${
                        exp.current
                          ? "bg-[var(--color-primary)] border-[var(--color-primary)]"
                          : "bg-[var(--color-bg)] border-[var(--color-border)]"
                      }`}
                      style={{ boxShadow: exp.current ? `0 0 0 4px var(--color-primary)/20` : "none" }}
                    />
                    <div className="card">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold">
                            {locale === "zh" ? exp.role : exp.roleEn}
                          </h3>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {locale === "zh" ? exp.company : exp.companyEn}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full border border-[var(--color-border)] px-3 py-0.5 text-xs text-[var(--color-text-muted)]">
                          {exp.period}
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                        {locale === "zh" ? exp.description : exp.descriptionEn}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* GitHub Dashboard */}
        <FadeIn delay={0.4}>
          <GitHubDashboard />
        </FadeIn>
      </div>
    </div>
  );
}
