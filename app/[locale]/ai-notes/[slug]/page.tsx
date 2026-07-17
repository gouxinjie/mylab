import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import React from "react";
import type { Components } from "react-markdown";
import Markdown from "@/components/commons/Markdown";
import { Link } from "@/lib/navigation";
import { getAllDocSlugs, getDocContent, getDocNeighbors } from "@/lib/ai-docs";
import styles from "./page.module.scss";
import BananaSlug from "github-slugger";

/**
 * AIDocPage
 * @description AI 笔记文章详情页：左侧紧凑正文 + 右侧吸顶 TOC 两栏阅读视图，读取对应 markdown 渲染，并提供上一篇/下一篇导航
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-17
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

/** 从 React 节点递归提取纯文本（用于从标题组件 children 中拿到原始文本） */
function getText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }
  if (React.isValidElement(node) && node.props.children) {
    return getText(node.props.children);
  }
  return "";
}

/**
 * 创建自定义 Markdown heading 组件，使用传入的 slugger 为 h2/h3/h4 生成唯一锚点 id。
 * 说明：与 TOC 提取共用同一个 slugger 实例，确保锚点 id 完全一致。
 */
function createHeadingComponents(slugger: BananaSlug): Components {
  const H2 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getText(children);
    const id = slugger.slug(text);
    return <h2 id={id} {...props}>{children}</h2>;
  };

  const H3 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getText(children);
    const id = slugger.slug(text);
    return <h3 id={id} {...props}>{children}</h3>;
  };

  const H4 = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    const text = getText(children);
    const id = slugger.slug(text);
    return <h4 id={id} {...props}>{children}</h4>;
  };

  return { h2: H2, h3: H3, h4: H4 };
}

/**
 * 从 markdown 原文中提取标题目录（h2/h3/h4），使用 BananaSlug 生成与正文一致的锚点 id。
 * @param content - Markdown 正文（已去除首个一级标题）
 * @returns 目录项数组，包含层级、标题文本与锚点 id
 */
function extractToc(content: string): { level: number; text: string; id: string }[] {
  const slugger = new BananaSlug();
  const headings: { level: number; text: string; id: string }[] = [];
  const lines = content.split("\n");

  for (const line of lines) {
    const match = line.match(/^(#{2,4})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = slugger.slug(text);
      headings.push({ level, text, id });
    }
  }

  return headings;
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

  // 提取本页目录（h2/h3/h4），标题锚点 id 与正文标题保持一致
  const toc = extractToc(bodyContent);

  // 创建自定义标题组件，使用同一个 slugger 确保 TOC 锚点与正文标题 id 完全一致
  const headingSlugger = new BananaSlug();
  const components = createHeadingComponents(headingSlugger);

  return (
    <article className={styles.doc}>
      {/* 两栏布局：左侧正文，右侧吸顶 TOC */}
      <div className={styles.layout}>
        {/* 右侧 TOC 目录：吸顶展示，点击锚点跳转 */}
        <aside className={styles.toc}>
          <h3 className={styles.toc__heading}>本页目录</h3>
          <nav className={styles.toc__nav}>
            {toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`${styles.toc__link} ${styles[`toc__link--level-${item.level}`]}`}
              >
                {item.text}
              </a>
            ))}
          </nav>
        </aside>

        {/* 左侧主区：返回 + 面包屑 + 紧凑正文 + 翻页 */}
        <div className={styles.main}>
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

            {/* 面包屑：分组归属 */}
            <div className={styles.breadcrumb}>
              <Link href="/ai-notes" className={styles.breadcrumb__link}>
                {t("title")}
              </Link>
              <span className={styles.breadcrumb__sep}>/</span>
              <span className={styles.breadcrumb__current}>{doc.group}</span>
            </div>

            {/* 文章页面级标题：对应 frontmatter 的 title（正文首个 # 已在第 127 行去除，避免重复渲染） */}
            <h1 className={styles.title}>{doc.title}</h1>
          </div>

          {/* Markdown 正文（已去除首个一级标题，避免与页面标题重复） */}
          <div className={styles.body}>
            <Markdown content={bodyContent} components={components} />
          </div>

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
        </div>
      </div>
    </article>
  );
}

