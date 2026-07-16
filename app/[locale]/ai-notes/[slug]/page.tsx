import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FadeIn from "@/components/commons/FadeIn";
import Markdown from "@/components/commons/Markdown";
import { Link } from "@/lib/navigation";
import { getAllDocSlugs, getDocContent, getDocNeighbors } from "@/lib/ai-docs";
import styles from "./page.module.scss";

/**
 * AIDocPage
 * @description AI 笔记文章详情页：全宽阅读视图，读取对应 markdown 渲染，并提供上一篇/下一篇导航
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-16
 */

/** 文章页路由参数 */
interface DocPageParams {
  params: {
    locale: string;
    slug: string;
  };
}

/**
 * 生成所有文章的静态路径
 * @returns slug 参数数组
 */
export function generateStaticParams() {
  return getAllDocSlugs().map((slug) => ({ slug }));
}

/**
 * 生成文章页 SEO 元信息
 * @param params - 路由参数
 * @returns 页面 Metadata
 */
export function generateMetadata({ params }: DocPageParams): Metadata {
  const doc = getDocContent(params.slug);
  return {
    title: doc ? doc.title : "AI 笔记",
  };
}

export default async function AIDocPage({ params }: DocPageParams) {
  const { locale, slug } = params;
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = await getTranslations("AINotes");

  // 读取文档内容，不存在则返回 404
  const doc = getDocContent(slug);
  if (!doc) {
    notFound();
  }

  // 获取上一篇 / 下一篇
  const { prev, next } = getDocNeighbors(slug);

  // 去除正文首个一级标题，避免与页面级 h1（doc.title）重复渲染
  const bodyContent = doc.content.replace(/^\s*#\s+.+\r?\n/, "");

  return (
    <article className={styles.doc}>
      <FadeIn>
        <div className={styles.header}>
          {/* 返回按钮：回到 AI 笔记列表 */}
          <Link href="/ai-notes" className={styles.back}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {t("back")}
          </Link>

          <h1 className={styles.title}>{doc.title}</h1>

          {/* 面包屑：分组归属 */}
          <div className={styles.breadcrumb}>
            <Link href="/ai-notes" className={styles.breadcrumb__link}>
              {t("title")}
            </Link>
            <span className={styles.breadcrumb__sep}>/</span>
            <span className={styles.breadcrumb__current}>{doc.group}</span>
          </div>

          {/* 更新时间 */}
          {doc.updated && (
            <p className={styles.meta}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              {t("updated_label")}：{doc.updated}
            </p>
          )}
        </div>

        {/* Markdown 正文（已去除首个一级标题，避免与页面标题重复） */}
        <div className={styles.body}>
          <Markdown content={bodyContent} />
        </div>
      </FadeIn>

      {/* 上一篇 / 下一篇导航 */}
      <nav className={styles.pager}>
        {prev ? (
          <Link href={`/ai-notes/${prev.slug}`} className={styles.pager__item}>
            <span className={styles.pager__label}>{t("prev")}</span>
            <span className={styles.pager__title}>{prev.text}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/ai-notes/${next.slug}`}
            className={`${styles.pager__item} ${styles["pager__item--next"]}`}
          >
            <span className={styles.pager__label}>{t("next")}</span>
            <span className={styles.pager__title}>{next.text}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
