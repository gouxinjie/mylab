/**
 * @component FeaturedProjects
 * @description 精选项目展示组件，点击卡片弹出项目详情
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-10
 */

"use client";

import { useState } from "react";
import { Link } from "@/lib/navigation";
import { projects, Project } from "@/lib/projects";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Modal from "@/components/commons/Modal";
import styles from "./index.module.scss";

/**
 * 从技术栈简述中提取简短标签
 * techStackBrief 已用「、」分隔各项技术，按此拆分后取前 3 个用于卡片标签展示
 * @param project - 项目数据
 * @returns 简短技术标签数组
 */
const getTechTags = (project: Project): string[] => {
  return project.techStackBrief
    .split("、")
    .map((tech) => tech.trim())
    .filter(Boolean)
    .slice(0, 3);
};

export default function FeaturedProjects({ limit }: { limit?: number }) {
  const t = useTranslations("FeaturedProjects");
  // 当前选中的项目（用于详情弹窗）
  const [selected, setSelected] = useState<Project | null>(null);

  // 限制展示数量（首页精选 3 个，全部项目页不传则展示全部）
  const visibleProjects = limit ? projects.slice(0, limit) : projects;

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
          {visibleProjects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <ProjectCard project={project} onOpen={() => setSelected(project)} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* 项目详情弹窗 */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.brief}
        subtitle={selected?.title}
      >
        {selected ? <ProjectDetail project={selected} /> : null}
      </Modal>
    </section>
  );
}

interface ProjectCardProps {
  /** 项目数据 */
  project: Project;
  /** 点击卡片打开详情回调 */
  onOpen: () => void;
}

function ProjectCard({ project, onOpen }: ProjectCardProps) {
  // 外链优先使用公网访问地址，其次使用仓库地址
  const externalUrl = project.url || project.repoUrl || undefined;
  const techTags = getTechTags(project);

  return (
    <article
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpen();
        }
      }}
    >
      {/* 封面区域：暂无封面图，使用标题占位 */}
      <div className={styles['card__image-box']}>
        <div className={styles.card__placeholder}>
          <svg
            className={styles['card__placeholder-icon']}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
          >
            <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
          </svg>
          <span className={styles['card__placeholder-title']}>
            {project.title}
          </span>
        </div>
        <span
          className={styles.card__status}
          data-status={project.status}
        >
          {project.status}
        </span>
      </div>

      {/* 内容区域 */}
      <div className={styles.card__content}>
        <div className={styles.card__top}>
          <h3 className={styles.card__title}>
            {project.brief}
          </h3>
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card__external}
              onClick={(event) => event.stopPropagation()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </a>
          ) : null}
        </div>
        <p className={styles.card__desc}>
          {project.description}
        </p>

        {/* 标签：取自技术栈简述 */}
        <div className={styles.card__tags}>
          {techTags.map((tag) => (
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

/**
 * 项目详情内容
 * @param project - 项目数据
 */
function ProjectDetail({ project }: { project: Project }) {
  const externalUrl = project.url || project.repoUrl || undefined;

  return (
    <div className={styles.detail}>
      {/* 状态与外链 */}
      <div className={styles.detail__meta}>
        <span
          className={styles.detail__status}
          data-status={project.status}
        >
          {project.status}
        </span>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.detail__link}
          >
            访问项目 →
          </a>
        ) : null}
      </div>

      {/* 完整描述 */}
      <p className={styles.detail__desc}>{project.description}</p>

      {/* 部署与运行信息 */}
      <dl className={styles.detail__list}>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>仓库地址</dt>
          <dd className={styles.detail__value}>
            {project.repoUrl ? (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">{project.repoUrl}</a>
            ) : (
              "无"
            )}
          </dd>
        </div>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>访问地址</dt>
          <dd className={styles.detail__value}>
            {project.url ? (
              <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>
            ) : (
              "无"
            )}
          </dd>
        </div>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>部署路径</dt>
          <dd className={styles.detail__value}>{project.deployPath}</dd>
        </div>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>启动方式</dt>
          <dd className={styles.detail__value}>{project.startMode}</dd>
        </div>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>端口</dt>
          <dd className={styles.detail__value}>{project.port}</dd>
        </div>
        <div className={styles.detail__row}>
          <dt className={styles.detail__label}>备注</dt>
          <dd className={styles.detail__value}>{project.remark}</dd>
        </div>
      </dl>

      {/* 技术栈（置于详情底部） */}
      <section className={styles.detail__section}>
        <h4 className={styles.detail__sectionTitle}>技术栈</h4>
        <p className={styles.detail__techBrief}>{project.techStackBrief}</p>
        <ul className={styles.detail__techList}>
          {project.techStackDetail.map((item) => (
            <li
              key={item.category}
              className={styles.detail__techItem}
            >
              <span className={styles.detail__techCategory}>{item.category}</span>
              <span className={styles.detail__techValue}>{item.tech}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
