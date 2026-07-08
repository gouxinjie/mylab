import { Metadata } from "next";
import { aiTools } from "@/lib/data";
import FadeIn from "@/components/FadeIn";
import { useTranslations, useLocale } from "next-intl";

export const metadata: Metadata = {
  title: "AI Exploration",
};

export default function AIPage() {
  const t = useTranslations("AI");
  const locale = useLocale();
  const projects = t.raw("projects") as Array<{ title: string; desc: string; tags: string[] }>;
  const articles = t.raw("articles") as Array<{ title: string }>;

  return (
    <div className="py-12 sm:py-16">
      <div className="container-custom">
        {/* Header */}
        <FadeIn>
          <div className="mb-10">
            <h1 className="text-3xl font-bold sm:text-4xl">{t("title")}</h1>
            <p className="mt-2 max-w-xl text-[var(--color-text-secondary)]">
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        {/* AI Projects */}
        <FadeIn delay={0.1}>
          <section className="mb-16">
            <h2 className="mb-6 text-lg font-semibold">{t("projects_title")}</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {projects.map((project, idx) => {
                return (
                  <FadeIn key={project.title} delay={0.1 * idx}>
                    <article className="card group">
                      <div className="mb-3 h-40 rounded-lg bg-gradient-to-br from-blue-900 to-purple-800 flex items-center justify-center text-white/20">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                          <path d="M12 8V4H8" /><rect x="4" y="8" width="10" height="8" rx="1"/>
                          <circle cx="18" cy="11" r="2"/><path d="M15 14l3 3"/><path d="M19 17a2 2 0 100 4 2 2 0 000-4z"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-3">
                        {project.desc}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[var(--color-border)] px-2 py-0.5 text-xs text-[var(--color-text-muted)]"
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
          <section>
            <h2 className="mb-6 text-lg font-semibold">{t("tool_stack_title")}</h2>
            <div className="flex flex-wrap gap-3">
              {aiTools.map((tool) => (
                <span
                  key={tool.name}
                  className="group inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-2 text-sm transition-all hover:border-[var(--color-primary)] hover:shadow-md"
                >
                  {locale === "zh" ? tool.name : (tool.name === "向量数据库" ? "Vector DB" : tool.name)}
                  <span className="rounded bg-gray-200 px-1.5 py-0.5 text-[10px] text-gray-500 transition-colors group-hover:bg-[var(--color-primary)]/10 group-hover:text-[var(--color-primary-dark)]">
                    {locale === "zh" ? tool.category : tool.categoryEn}
                  </span>
                </span>
              ))}
            </div>
          </section>
        </FadeIn>

        {/* Blog Articles Index */}
        <FadeIn delay={0.35}>
          <section className="mt-16">
            <h2 className="mb-6 text-lg font-semibold">{t("articles_title")}</h2>
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              {t("articles_subtitle")}
            </p>
            <div className="space-y-3">
              {articles.map((article, idx) => (
                <FadeIn key={article.title} delay={0.1 * idx}>
                  <a
                    href={`https://blog.gouxinjie.com?q=${encodeURIComponent(article.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[var(--color-border)] p-4 transition-all hover:border-[var(--color-primary)] hover:bg-[var(--color-bg-secondary)]"
                  >
                    <div>
                      <h3 className="text-sm font-medium">{article.title}</h3>
                      <span className="mt-1 text-xs text-[var(--color-text-muted)]">
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
                      className="shrink-0 text-[var(--color-text-muted)] transition-transform group-hover:translate-x-0.5"
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
