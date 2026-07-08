"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { projects, Project } from "@/lib/data";
import { useTranslations, useLocale } from "next-intl";

/**
 * @component FeaturedProjects
 * @description 精选项目展示组件，支持分类筛选
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */

const categoryColors: Record<string, string> = {
  fullstack: "bg-orange-100 text-orange-700",
  ai: "bg-blue-100 text-blue-700",
  tool: "bg-green-100 text-green-700",
  opensource: "bg-purple-100 text-purple-700",
};

export default function FeaturedProjects() {
  const [activeCategory, setActiveCategory] = useState("all");
  const t = useTranslations("FeaturedProjects");
  const locale = useLocale();

  const categories = [
    { key: "all", label: t("categories.all") },
    { key: "fullstack", label: t("categories.fullstack") },
    { key: "ai", label: t("categories.ai") },
    { key: "tool", label: t("categories.tool") },
    { key: "opensource", label: t("categories.opensource") },
  ];

  const filtered = activeCategory === "all"
    ? projects.filter((p) => p.featured)
    : projects.filter((p) => p.category === activeCategory && p.featured);

  return (
    <section className="py-12 sm:py-16 lg:py-20">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="section-title">{t("title")}</h2>
            <p className="mt-1.5 sm:mt-2 text-sm text-[var(--color-text-secondary)]">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden text-sm font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-primary-dark)] sm:block"
          >
            {t("view_all")}
          </Link>
        </div>

        {/* Category Filter */}
        <div className="mt-6 sm:mt-8 flex flex-wrap gap-1.5 sm:gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all active:scale-95 ${
                activeCategory === cat.key
                  ? "bg-[var(--color-primary)] text-white shadow-md"
                  : "border border-[var(--color-border)] bg-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Mobile Link */}
        <div className="mt-6 block text-center sm:hidden">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1 text-sm font-medium text-[var(--color-primary)]"
          >
            {t("view_all")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale();
  const t = useTranslations("FeaturedProjects");
  
  return (
    <article className="group card flex flex-col overflow-hidden p-0">
      {/* Image Placeholder */}
      <div className="relative h-32 sm:h-40 w-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="absolute inset-0 flex items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" className="opacity-50 sm:w-12 sm:h-12">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </div>
        {/* Category Tag */}
        <span className={`absolute top-2.5 left-2.5 sm:top-3 sm:left-3 text-[11px] sm:text-xs tag ${categoryColors[project.category] || "bg-gray-200 text-gray-700"}`}>
          {t(`categories.${project.category}`)}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2.5 sm:gap-3 p-3.5 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base">
          {locale === "zh" ? project.title : project.titleEn}
        </h3>
        <p className="flex-1 text-xs sm:text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">
          {locale === "zh" ? project.description : project.descriptionEn}
        </p>

        {/* Tags (first 3) */}
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--color-border)] px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-[var(--color-text-muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats & Links */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] sm:text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-0.5 sm:gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              {project.stars}
            </span>
            <span className="inline-flex items-center gap-0.5 sm:gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-3 sm:h-3"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v-2a2 2 0 012-2h4a2 2 0 012 2v2"/><path d="M12 10V2"/></svg>
              {project.forks}
            </span>
          </div>
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)] active:scale-95"
              aria-label="GitHub"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="sm:w-4 sm:h-4"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
