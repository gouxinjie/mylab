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

  return (
    <article className={styles.doc}>
      <FadeIn>
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
            {t("updated_label")}：{doc.updated}
          </p>
        )}

        {/* Markdown 正文 */}
        <div className={styles.body}>
          <Markdown content={doc.content} />
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
