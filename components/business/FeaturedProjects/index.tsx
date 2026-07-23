/**
 * @component FeaturedProjects
 * @description 精选项目展示组件，点击卡片弹出项目详情
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-18
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import { Link } from "@/lib/navigation";
import { projects, Project, ProjectCategory } from "@/lib/projects";
import { useTranslations } from "next-intl";
import FadeIn from "@/components/commons/FadeIn";
import Modal from "@/components/commons/Modal";
import Lightbox from "@/components/commons/Lightbox";
import Image from "next/image";
import styles from "./index.module.scss";

export default function FeaturedProjects({ limit, showFilters }: { limit?: number; showFilters?: boolean }) {
  const t = useTranslations("FeaturedProjects");
  // 当前选中的项目（用于详情弹窗）
  const [selected, setSelected] = useState<Project | null>(null);
  // 当前激活的分类筛选
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");
  // 搜索关键词
  const [searchQuery, setSearchQuery] = useState<string>("");
  // 灯箱预览的图片地址（点击项目截图时设置）
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);

  // 是否展示筛选栏：首页不展示，全部项目页默认展示
  const showFilterBar = showFilters ?? !limit;

  // 分类筛选项：键与中文分类值对应，便于与项目数据匹配；依赖翻译，翻译不变则缓存
  const CATEGORY_OPTIONS = useMemo<{ key: string; value: ProjectCategory | "all"; label: string }[]>(
    () => [
      { key: "all", value: "all", label: t("categories.all") },
      { key: "platform", value: "平台", label: t("categories.platform") },
      { key: "application", value: "应用", label: t("categories.application") },
      { key: "tool", value: "工具", label: t("categories.tool") },
      { key: "dataviz", value: "数据可视化", label: t("categories.dataviz") },
      { key: "learning", value: "学习研究", label: t("categories.learning") },
      { key: "other", value: "其他", label: t("categories.other") },
    ],
    [t]
  );

  // 按排序权重升序排列（静态数据，仅计算一次，避免每次渲染重复排序）
  const sortedProjects = useMemo(() => [...projects].sort((a, b) => a.order - b.order), []);
  // 按 limit 截取（首页精选 N 个，全部项目页不传则展示全部）
  const baseProjects = useMemo(
    () => (limit ? sortedProjects.slice(0, limit) : sortedProjects),
    [limit, sortedProjects]
  );

  // 根据分类与搜索关键词过滤；仅在依赖变化时重算
  const visibleProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return baseProjects.filter((project) => {
      const categoryMatch = activeCategory === "all" || project.category === activeCategory;
      const searchMatch = !query || (
        project.title.toLowerCase().includes(query) ||
        project.brief.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.tags.some((tag) => tag.toLowerCase().includes(query))
      );
      return categoryMatch && searchMatch;
    });
  }, [baseProjects, activeCategory, searchQuery]);

  return (
    <section className={styles.projects}>
      <div className="container-custom">
        {showFilterBar ? (
          <div className={styles.filterBar}>
            <div className={styles.filterBar__tabs}>
              {CATEGORY_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className={`${styles.filterBar__tab} ${
                    activeCategory === option.value ? styles["filterBar__tab--active"] : ""
                  }`}
                  onClick={() => setActiveCategory(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className={styles.filterBar__search}>
              <svg
                className={styles.filterBar__icon}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                placeholder={t("search_placeholder")}
                onChange={(event) => setSearchQuery(event.target.value)}
                className={styles.filterBar__input}
              />
            </div>
          </div>
        ) : (
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
        )}

        {/* 项目列表 */}
        <div className={styles.grid}>
          {visibleProjects.map((project, idx) => (
            <FadeIn key={project.id} delay={idx * 0.1}>
              <ProjectCard project={project} onOpen={() => setSelected(project)} />
            </FadeIn>
          ))}
        </div>
      </div>

      {/* 项目详情弹窗 */}
      <Modal
        open={selected !== null}
        onClose={() => {
          setSelected(null);
          // 关闭详情时同步关闭可能仍在展示的放大灯箱
          setZoomSrc(null);
        }}
        title={selected?.brief}
        subtitle={selected?.title}
      >
        {selected ? <ProjectDetail project={selected} onZoom={setZoomSrc} /> : null}
      </Modal>

      {/* 复用公共图片放大灯箱：点击遮罩/关闭按钮/Esc 关闭，按图片原始比例自适应铺满视口 */}
      <Lightbox
        open={zoomSrc !== null}
        src={zoomSrc ?? ""}
        alt={selected?.title ?? ""}
        onClose={() => setZoomSrc(null)}
      />
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
      {/* 封面区域：展示首张静态封面图，无图时使用标题占位 */}
      <div className={styles['card__image-box']}>
        {project.covers.length > 0 ? (
          <>
            {/* 模糊背景层：同图放大模糊铺满容器，避免 contain 留白露出底色，提升观感 */}
            <Image
              src={project.covers[0]}
              alt=""
              aria-hidden
              fill
              quality={80}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className={styles['card__cover-bg']}
              loading="lazy"
            />
            <Image
              src={project.covers[0]}
              alt={`${project.title} 封面`}
              fill
              quality={95}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className={styles.card__cover}
              loading="lazy"
            />
          </>
        ) : (
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
        )}
      </div>

      {/* 内容区域 */}
      <div className={styles.card__content}>
        {/* 状态：圆点 + 文字 */}
        <span
          className={styles.card__status}
          data-status={project.status}
        >
          <span className={styles.card__statusDot} />
          {project.status}
        </span>
        <div className={styles.card__top}>
          <h3 className={styles.card__title}>
            {project.brief}
          </h3>
          <span className={styles.card__categoryTag}>
            {project.category}
          </span>
        </div>
        <p className={styles.card__desc}>
          {project.description}
        </p>

        {/* 标签与链接：标签居左，仓库/项目图标居右 */}
        <div className={styles.card__footer}>
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
          <div className={styles.card__links}>
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card__link}
                onClick={(event) => event.stopPropagation()}
                aria-label="仓库地址"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
                </svg>
              </a>
            ) : null}
            {project.url ? (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.card__link}
                onClick={(event) => event.stopPropagation()}
                aria-label="访问项目"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * 项目详情内容
 * @param project - 项目数据
 */
/**
 * 根据项目状态与部署情况，生成详情页顶部的外部链接文案与目标 URL
 * @returns { label: string; url: string } 或 null（无可访问链接）
 */
function getDetailExternalLink(project: Project): { label: string; url: string } | null {
  // 已上线的项目优先展示线上地址
  if (project.url) {
    return { label: "访问项目", url: project.url };
  }
  // 未上线但有仓库地址时展示"查看仓库"
  if (project.repoUrl) {
    return { label: "查看仓库", url: project.repoUrl };
  }
  return null;
}

function ProjectDetail({
  project,
  onZoom,
}: {
  project: Project;
  /** 点击项目截图时回调，用于打开放大预览 */
  onZoom: (src: string) => void;
}) {
  const externalLink = getDetailExternalLink(project);

  return (
    <div className={styles.detail}>
      {/* 状态与外链 */}
      <div className={styles.detail__meta}>
        <span
          className={styles.detail__status}
          data-status={project.status}
        >
          <span className={styles.detail__statusDot} />
          {project.status}
        </span>
        {externalLink ? (
          <a
            href={externalLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.detail__link}
          >
            {externalLink.label}<span className={styles.detail__arrow}>→</span>
          </a>
        ) : null}
      </div>

      {/* 完整描述 */}
      <p className={styles.detail__desc}>{project.description}</p>

      <hr className={styles.detail__divider} />

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
        {project.deployPath ? (
          <div className={styles.detail__row}>
            <dt className={styles.detail__label}>部署路径</dt>
            <dd className={styles.detail__value}>{project.deployPath}</dd>
          </div>
        ) : null}
        {project.startMode ? (
          <div className={styles.detail__row}>
            <dt className={styles.detail__label}>启动方式</dt>
            <dd className={styles.detail__value}>{project.startMode}</dd>
          </div>
        ) : null}
        {project.port ? (
          <div className={styles.detail__row}>
            <dt className={styles.detail__label}>端口</dt>
            <dd className={styles.detail__value}>{project.port}</dd>
          </div>
        ) : null}
        {project.remark ? (
          <div className={styles.detail__row}>
            <dt className={styles.detail__label}>备注</dt>
            <dd className={styles.detail__value}>{project.remark}</dd>
          </div>
        ) : null}
      </dl>

      <hr className={styles.detail__divider} />

      {/* 技术栈（置于详情底部） */}
      <section className={styles.detail__section}>
        <h4 className={styles.detail__sectionTitle}>技术栈</h4>
        <div className={styles.detail__techBrief}>
          {project.techStackBrief
            .split(/[、,，]/)
            .map((tech) => tech.trim())
            .filter(Boolean)
            .map((tech) => (
              <span
                key={tech}
                className={styles.detail__techBriefTag}
              >
                {tech}
              </span>
            ))}
        </div>
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

      <hr className={styles.detail__divider} />

      {/* 封面轮播（置于详情末尾） */}
      <section className={styles.detail__section}>
        <h4 className={styles.detail__sectionTitle}>项目截图</h4>
        <CoverCarousel covers={project.covers} title={project.title} autoPlay onZoom={onZoom} />
      </section>
    </div>
  );
}

/**
 * 封面轮播组件
 * @param covers - 封面图地址数组（第一张为封面）
 * @param title - 项目标题（用于 alt 与无障碍）
 * @param fill - 是否填充父容器（卡片封面场景），默认 false 为独立块
 * @param autoPlay - 是否自动轮播（卡片场景常用）
 * @param showArrows - 是否显示左右切换箭头（详情场景常用）
 */
function CoverCarousel({
  covers,
  title,
  autoPlay = false,
  showArrows = true,
  onZoom,
}: {
  covers: string[];
  title: string;
  autoPlay?: boolean;
  showArrows?: boolean;
  /** 点击图片时回调（用于打开放大预览），入参为当前图片地址 */
  onZoom?: (src: string) => void;
}) {
  const [index, setIndex] = useState(0);

  // 自动轮播：仅多图且开启时生效，组件卸载时清理定时器
  useEffect(() => {
    if (!autoPlay || covers.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % covers.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [autoPlay, covers.length]);

  // 无封面时显示占位提示
  if (covers.length === 0) {
    return (
      <div
        className={`${styles.carousel} ${styles["carousel__empty"]}`}
      >
        暂无封面图
      </div>
    );
  }

  // 切换到上一张/下一张（循环）
  const go = (direction: number) => {
    setIndex((current) => (current + direction + covers.length) % covers.length);
  };

  return (
    <div
      className={`${styles.carousel}`}
      // 点击整个轮播区域（含模糊背景）即可放大当前图；箭头/指示点已 stopPropagation，互不冲突
      onClick={() => onZoom?.(covers[index])}
    >
      {/* 模糊背景层：同图放大模糊铺满容器，避免 contain 留白露出底色 */}
      <Image
        src={covers[index]}
        alt=""
        aria-hidden
        fill
        quality={80}
        sizes="(max-width: 640px) 100vw, 640px"
        className={styles['carousel__bg']}
        loading="lazy"
      />
      <Image
        key={index}
        src={covers[index]}
        alt={`${title} 封面 ${index + 1}`}
        fill
        quality={95}
        sizes="(max-width: 640px) 100vw, 640px"
        className={styles.carousel__img}
        loading="lazy"
      />
      {/* 触摸设备提示"点击放大"（CSS 控制在 coarse pointer 时显示） */}
      <span className={styles.carousel__zoomHint} aria-hidden>
        点击放大
      </span>
      {covers.length > 1 ? (
        <>
          {/* 左右箭头：仅详情场景展示 */}
          {showArrows ? (
            <>
              <button
                type="button"
                className={`${styles.carousel__btn} ${styles["carousel__btn--prev"]}`}
                onClick={(event) => {
                  event.stopPropagation();
                  go(-1);
                }}
                aria-label="上一张"
              >
                ‹
              </button>
              <button
                type="button"
                className={`${styles.carousel__btn} ${styles["carousel__btn--next"]}`}
                onClick={(event) => {
                  event.stopPropagation();
                  go(1);
                }}
                aria-label="下一张"
              >
                ›
              </button>
            </>
          ) : null}
          {/* 指示点：始终展示 */}
          <div className={styles.carousel__dots}>
            {covers.map((cover, dotIndex) => (
              <button
                type="button"
                key={cover}
                className={`${styles.carousel__dot} ${dotIndex === index ? styles["carousel__dot--active"] : ""}`}
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(dotIndex);
                }}
                aria-label={`第 ${dotIndex + 1} 张`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
