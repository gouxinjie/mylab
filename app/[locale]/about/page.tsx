/**
 * @component AboutPage
 * @description 关于我页面，参考设计稿重新设计
 * @author gouxinjie
 * @created 2025-06-01
 * @updated 2025-07-14
 */

import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import {
  BookOpen,
  Code2,
  Users,
  Lightbulb,
} from "lucide-react";
import {
  experiences,
  values,
  aboutStats,
  aboutSkillGroups,
  techCategories,
  aboutContacts,
  type Experience,
  type Value,
  type SkillBarGroup,
} from "@/lib/data";
import FadeIn from "@/components/commons/FadeIn";
import AboutContact from "@/components/commons/AboutContact";
import styles from "./page.module.scss";

// 价值观图标映射
const valueIcons: Record<string, JSX.Element> = {
  "book-open": <BookOpen size={24} />,
  "code-2": <Code2 size={24} />,
  users: <Users size={24} />,
  lightbulb: <Lightbulb size={24} />,
};

export default function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = useTranslations("About");

  return (
    <div className={styles.about}>
      {/* Hero 区域：头像居中 + 姓名 + 标语 + 描述 */}
      <section className={styles.hero}>
        <div className={styles.hero__glow} />
        <div className={styles.hero__dots} />
        <div className="container-custom">
          <div className={styles.hero__inner}>
            <FadeIn>
              <div className={styles.hero__avatar}>
                <img
                  src="/images/avatar.png"
                  alt="Avatar"
                  className={styles.hero__avatarImg}
                />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className={styles.hero__info}>
                <h1 className={styles.hero__name}>{t("name")}</h1>
                <p className={styles.hero__tagline}>{t("tagline")}</p>
                <p className={styles.hero__desc}>{t("description")}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* 数据概览区域 */}
      <section className={styles.section} id="stats">
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("stats_title")}</h2>
          </FadeIn>
          <div className={styles.statsGrid}>
            {aboutStats.map((stat, idx) => (
              <FadeIn key={stat.label} delay={0.05 * idx}>
                <div className={styles.statCard}>
                  <span className={styles.statCard__icon}>{stat.icon}</span>
                  <span className={styles.statCard__value}>{stat.value}</span>
                  <span className={styles.statCard__label}>
                    {locale === "zh" ? stat.label : stat.labelEn}
                  </span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 技能概览区域（进度条） */}
      <section className={styles.section}>
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("skills_bar_title")}</h2>
            <p className={styles.section__subtitle}>{t("skills_bar_subtitle")}</p>
          </FadeIn>
          <div className={styles.skillsBarGrid}>
            {aboutSkillGroups.map((group: SkillBarGroup, idx: number) => (
              <FadeIn key={group.title} delay={0.05 * idx}>
                <div className={styles.skillsBarGroup}>
                  <h4 className={styles.skillsBarGroup__title}>
                    {locale === "zh" ? group.title : group.titleEn}
                  </h4>
                  {group.items.map((item) => (
                    <div key={item.name} className={styles.skillsBar}>
                      <div className={styles.skillsBar__label}>
                        <span>{item.name}</span>
                        <span>{item.level}%</span>
                      </div>
                      <div className={styles.skillsBar__track}>
                        <div
                          className={styles.skillsBar__fill}
                          style={{ width: `${item.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 技术清单区域 */}
      <section className={styles.section} id="tech">
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("tech_title")}</h2>
            <p className={styles.section__subtitle}>{t("tech_subtitle")}</p>
          </FadeIn>
          <FadeIn delay={0.05}>
            <div className={styles.techGroup}>
              {techCategories.map((category) => (
                <div key={category.title} className={styles.techGroup__section}>
                  <h4 className={styles.techGroup__title}>
                    {locale === "zh" ? category.title : category.titleEn}
                  </h4>
                  <div className={styles.techGroup__badges}>
                    {category.badges.map((badge) => (
                      <img
                        key={badge.label}
                        src={badge.img}
                        alt={badge.label}
                        loading="lazy"
                        className={styles.techBadge}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 成长足迹区域 */}
      <section className={styles.section}>
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("experience_title")}</h2>
          </FadeIn>
          <div className={styles.expTimeline}>
            {experiences.map((exp: Experience, idx: number) => (
              <FadeIn key={exp.id} delay={0.1 * idx}>
                <div className={styles.expItem}>
                  <div className={styles.expItem__date}>{exp.period}</div>
                  <div className={styles.expItem__title}>
                    {locale === "zh" ? exp.role : exp.roleEn}
                    <span className={styles.expItem__divider}>·</span>
                    <span className={styles.expItem__company}>
                      {locale === "zh" ? exp.company : exp.companyEn}
                    </span>
                  </div>
                  <p className={styles.expItem__content}>
                    {locale === "zh" ? exp.description : exp.descriptionEn}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 联系方式区域 */}
      <section className={styles.section} id="contact">
        <div className="container-custom">
          <FadeIn>
            <h2 className={styles.section__title}>{t("contact_title")}</h2>
            <p className={styles.section__subtitle}>{t("contact_subtitle")}</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <AboutContact
              links={aboutContacts}
              locale={locale}
              copyHint={t("contact_copy_hint")}
              copySuccess={t("copy_success")}
              copyFail={t("copy_fail")}
            />
          </FadeIn>
        </div>
      </section>

      {/* 价值观区域 */}
      <section className={styles.section}>
        <div className="container-custom">
          <div className={styles.valuesGrid}>
            {values.map((value: Value, idx: number) => (
              <FadeIn key={value.id} delay={0.1 * idx}>
                <div className={styles.valueCard}>
                  <div className={styles.valueCard__icon}>{valueIcons[value.icon] || <Lightbulb size={24} />}</div>
                  <h3 className={styles.valueCard__title}>{locale === "zh" ? value.title : value.titleEn}</h3>
                  <p className={styles.valueCard__desc}>{locale === "zh" ? value.description : value.descriptionEn}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
