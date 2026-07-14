import { Metadata } from "next";
import { aiTools } from "@/lib/data";
import FadeIn from "@/components/commons/FadeIn";
import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "AI Exploration",
};

export default function AIPage({ params: { locale } }: { params: { locale: string } }) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = useTranslations("AI");
  const projects = t.raw("projects") as Array<{ title: string; desc: string; tags: string[] }>;
  const articles = t.raw("articles") as Array<{ title: string }>;

  return (
    <div className={styles['ai-page']}>
      <div className="container-custom">
        {/* Header */}
        <FadeIn>
          <div className={styles.header}>
            <h1 className={styles.header__title}>{t("title")}</h1>
            <p className={styles.header__subtitle}>
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        {/* AI Projects */}
        <FadeIn delay={0.1}>
          <section className={styles.section}>
            <h2 className={styles.section__title}>{t("projects_title")}</h2>
            <div className={styles['project-grid']}>
              {projects.map((project, idx) => {
                return (
                  <FadeIn key={project.title} delay={0.1 * idx}>
                    <article className={styles['project-card']}>
                      <div className={styles['project-card__preview']}>
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M12 8V4H8" /><rect x="4" y="8" width="10" height="8" rx="1"/>
                          <circle cx="18" cy="11" r="2"/><path d="M15 14l3 3"/><path d="M19 17a2 2 0 100 4 2 2 0 000-4z"/>
                        </svg>
                      </div>
                      <h3 className={styles['project-card__title']}>{project.title}</h3>
                      <p className={styles['project-card__desc']}>
                        {project.desc}
                      </p>
                      <div className={styles['project-card__tags']}>
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className={styles['project-card__tag']}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </article>
                  </FadeIn>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* AI Tool Stack */}
        <FadeIn delay={0.25}>
          <section className={styles.section}>
            <h2 className={styles.section__title}>{t("tool_stack_title")}</h2>
            <div className={styles['tool-stack']}>
              {aiTools.map((tool) => (
                <span
                  key={tool.name}
                  className={styles['tool-item']}
                >
                  {locale === "zh" ? tool.name : (tool.name === "向量数据库" ? "Vector DB" : tool.name)}
                  <span className={styles['tool-item__category']}>
                    {locale === "zh" ? tool.category : tool.categoryEn}
                  </span>
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Blog Articles Index */}
        <FadeIn delay={0.35}>
          <section className={`${styles.section} ${styles['section--last']}`}>
            <h2 className={styles.section__title}>{t("articles_title")}</h2>
            <p className={styles.articles__subtitle}>
              {t("articles_subtitle")}
            </p>
            <div className={styles.articles__list}>
              {articles.map((article, idx) => (
                <FadeIn key={article.title} delay={0.1 * idx}>
                  <a
                    href={`https://blog.gouxinjie.com?q=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles['article-item']}
                  >
                    <div>
                      <h3 className={styles['article-item__title']}>{article.title}</h3>
                      <span className={styles['article-item__meta']}>
                        {idx === 0 ? "2024-03 · 15 min" : idx === 1 ? "2024-02 · 20 min" : "2024-01 · 12 min"}
                      </span>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={styles['article-item__icon']}
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                </FadeIn>
              ))}
            </div>
          </section>
        </FadeIn>
      </div>
    </div>
  );
}
