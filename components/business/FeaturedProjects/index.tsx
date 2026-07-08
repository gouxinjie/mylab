/**
 * @component FeaturedProjects
 * @description 精选项目展示组件
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-08
 */

"use client";

import { Link } from "@/lib/navigation";
import { projects, Project } from "@/lib/data";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

export default function FeaturedProjects() {
  const t = useTranslations("FeaturedProjects");

  const featured = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <section className={styles.projects}>
      <div className="container-custom">
        <div className={styles.header}>
          <h2 className={styles.header__title}>
            {t("title")}
          </h2>
          <Link
            href="/projects"
            className={styles.header__link}
          >
            {t("view_all")}
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* 项目列表 */}
        <div className={styles.grid}>
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
    <article className={styles.card}>
      {/* 图片区域 */}
      <div className={styles['card__image-box']}>
        <div className={styles.card__fallback}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
          </svg>
        </div>
        {project.image && (
          <img
            src={project.image}
            alt={project.title}
            className={styles.card__img}
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
      <div className={styles.card__content}>
        <div className={styles.card__top}>
          <h3 className={styles.card__title}>
            {locale === "zh" ? project.title : project.titleEn}
          </h3>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card__external}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ) : null}
        </div>
        <p className={styles.card__desc}>
          {locale === "zh" ? project.description : project.descriptionEn}
        </p>

        {/* 标签 */}
        <div className={styles.card__tags}>
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={styles.card__tag}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
