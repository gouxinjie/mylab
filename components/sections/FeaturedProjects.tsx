"use client";

import { Link } from "@/lib/navigation";
import { projects, Project } from "@/lib/data";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

/**
 * @component FeaturedProjects
 * @description 精选项目展示组件，按照设计稿重新实现
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-08
 */

export default function FeaturedProjects() {
  const t = useTranslations("FeaturedProjects");

  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className="py-8 bg-white">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {t("title")}
          </h2>
          <Link
            href="/projects"
            className="group inline-flex items-center text-sm font-medium text-[#10b981] transition-colors hover:text-[#059669]"
          >
            {t("view_all")}
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 项目列表 */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const locale = useLocale();
  const externalUrl = project.githubUrl ?? project.demoUrl;
  
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all hover:shadow-2xl hover:shadow-gray-200/50">
      {/* 图片区域 */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white/10">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </div>
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallbackApplied === "1") return;
              img.dataset.fallbackApplied = "1";
              img.style.display = "none";
            }}
          />
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
            {locale === "zh" ? project.title : project.titleEn}
          </h3>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-[#10b981]"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : null}
        </div>
        <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)] line-clamp-2">
          {locale === "zh" ? project.description : project.descriptionEn}
        </p>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600 border border-gray-100"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
