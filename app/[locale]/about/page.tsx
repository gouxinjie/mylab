/**
 * AboutPage
 * @description 关于我页面
 * @author gouxinjie
 */

import { Metadata } from "next";
import { experiences, skills } from "@/lib/data";
import GitHubDashboard from "@/components/business/GitHubDashboard";
import FadeIn from "@/components/commons/FadeIn";
import { useTranslations, useLocale } from "next-intl";
import styles from "./page.module.scss";

export default function AboutPage() {
  const t = useTranslations("About");
  const locale = useLocale();

  return (
    <div className={styles.about}>
      <div className="container-custom" style={{ maxWidth: '896px' }}>
        {/* Header */}
        <FadeIn>
          <div className={styles.header}>
            <h1 className={styles.header__title}>{t("title")}</h1>
          </div>
        </FadeIn>

        {/* Bio */}
        <FadeIn delay={0.1}>
          <section className={styles.bio}>
            <h2 className={styles.bio__title}>{t("bio_title")}</h2>
            <p className={styles.bio__text}>
              {t("bio_1")}
            </p>
            <p className={styles.bio__text} style={{ marginTop: '16px' }}>
              {t("bio_2")}
            </p>
            <p className={styles.bio__text} style={{ marginTop: '16px' }}>
              {t("bio_3")}
            </p>
          </section>
        </FadeIn>

        {/* Skills */}
        <FadeIn delay={0.2}>
          <section className={styles.section}>
            <h2 className={`section-title ${styles.section__title}`}>{t("skills_title")}</h2>
            <div className={styles['skill-list']}>
              {skills.map((skill) => (
                <span
                  key={skill.name}
                  className={styles['skill-tag']}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Experience Timeline */}
        <FadeIn delay={0.3}>
          <section className={styles.section}>
            <h2 className={`section-title ${styles.section__title}`}>{t("experience_title")}</h2>
            <div className={styles.timeline}>
              {experiences.map((exp, idx) => (
                <FadeIn key={exp.id} delay={0.1 * idx}>
                  <div className={styles.timeline__item}>
                    <span
                      className={`${styles.timeline__dot} ${exp.current ? styles['timeline__dot--current'] : ''}`}
                    />
                    <div className={styles['exp-card']}>
                      <div className={styles['exp-card__header']}>
                        <div>
                          <h3 className={styles['exp-card__role']}>
                            {locale === "zh" ? exp.role : exp.roleEn}
                          </h3>
                          <p className={styles['exp-card__company']}>
                            {locale === "zh" ? exp.company : exp.companyEn}
                          </p>
                        </div>
                        <span className={styles['exp-card__period']}>
                          {exp.period}
                        </span>
                      </div>
                      <p className={styles['exp-card__desc']}>
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
