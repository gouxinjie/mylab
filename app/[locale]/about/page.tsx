/**
 * @component AboutPage
 * @description 关于我页面，参考设计稿重新设计
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-15
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
  techCategories,
  type Experience,
  type Value,
} from "@/lib/data";
import FadeIn from "@/components/commons/FadeIn";
import Section from "@/components/commons/Section";
import GitHubDashboard from "@/components/business/GitHubDashboard";
import Image from "next/image";
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
                <Image
                  src="/images/avatar.png"
                  alt="Avatar"
                  width={136}
                  height={136}
                  className={styles.hero__avatarImg}
                  priority
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
      <Section id="stats" title={t("stats_title")} subtitle={t("stats_subtitle")}>
        <div className={styles.statsGrid}>
          {aboutStats.map((stat, idx) => (
            <FadeIn key={stat.label} delay={0.05 * idx}>
              <div className={styles.statCard}>
                <span
                  className={styles.statCard__icon}
                  style={{ backgroundColor: stat.bgColor, color: stat.color }}
                >
                  {stat.icon}
                </span>
                <span
                  className={styles.statCard__value}
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
                <span className={styles.statCard__label}>
                  {locale === "zh" ? stat.label : stat.labelEn}
                </span>
                <span
                  className={styles.statCard__bar}
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* GitHub 数据看板（含贡献热力图） */}
      <FadeIn>
        <GitHubDashboard />
      </FadeIn>

      {/* 技术清单区域 */}
      <Section id="tech" title={t("tech_title")} subtitle={t("tech_subtitle")}>
        <FadeIn delay={0.05}>
          <div className={styles.techGroup}>
            {techCategories.map((category) => (
              <div key={category.title} className={styles.techGroup__section}>
                <h4 className={styles.techGroup__title}>
                  {locale === "zh" ? category.title : category.titleEn}
                </h4>
                <div className={styles.techGroup__badges}>
                  {/* 技术徽章为远程 SVG（shields.io），矢量图无法被 next/image 优化，
                      使用 unoptimized 由浏览器直接加载原始 SVG，避免优化器拒绝 SVG 导致不显示 */}
                  {category.badges.map((badge) => (
                  <Image
                    key={badge.label}
                    src={badge.img}
                    alt={badge.label}
                    width={88}
                    height={20}
                    loading="lazy"
                    className={styles.techBadge}
                    unoptimized
                  />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </Section>

      {/* 成长足迹区域 */}
      <Section title={t("experience_title")} subtitle={t("experience_subtitle")}>
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
      </Section>

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
