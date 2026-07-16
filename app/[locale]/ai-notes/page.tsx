import { Fragment, type ReactNode } from "react";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FadeIn from "@/components/commons/FadeIn";
import { Link } from "@/lib/navigation";
import { aiDocGroups, type AiDocNode } from "@/lib/ai-docs";
import styles from "./page.module.scss";

/**
 * AINotesPage
 * @description AI 笔记概览页：按分组展示 AI 基础认知与工具提效相关的文档卡片
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-16
 */

export const metadata: Metadata = {
  title: "AI 笔记",
};

export default async function AINotesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = await getTranslations("AINotes");

  /**
   * 递归渲染文档节点为卡片
   * @description 顶层可点击文档直接渲染卡片；无 slug 的节点视为子分组，渲染子分组标题后递归其子文档
   * @param nodes - 文档节点列表
   * @returns 卡片 / 子分组标题组成的节点数组
   */
  const renderDocNodes = (nodes: AiDocNode[]): ReactNode => {
    return nodes.map((node) => {
      // 可点击文档：渲染为卡片
      if (node.slug) {
        return (
          <Link
            key={node.slug}
            href={`/ai-notes/${node.slug}`}
            className={styles.docCard}
          >
            <span className={styles.docCard__title}>{node.text}</span>
            <span className={styles.docCard__read}>
              {t("read")}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </span>
          </Link>
        );
      }
      // 子分组（如 AGENTS 规则约束）：渲染跨列标题后递归子文档
      if (node.items && node.items.length > 0) {
        return (
          <Fragment key={node.text}>
            <h3 className={styles.docGroup__sub}>{node.text}</h3>
            {renderDocNodes(node.items)}
          </Fragment>
        );
      }
      return null;
    });
  };

  return (
    <div className={styles.home}>
      {/* 首页头部：介绍 + 开始阅读 */}
      <FadeIn>
        <header className={styles.hero}>
          <span className={styles.hero__badge}>AI NOTES</span>
          <h1 className={styles.hero__title}>{t("title")}</h1>
          <p className={styles.hero__subtitle}>{t("subtitle")}</p>
        </header>
      </FadeIn>

      {/* 按分组展示文档卡片 */}
      <div className={styles.docGroups}>
        {aiDocGroups.map((group, gi) => (
          <FadeIn key={group.text} delay={0.06 * gi}>
            <section className={styles.docGroup}>
              <h2 className={styles.docGroup__title}>{group.text}</h2>
              <div className={styles.docGrid}>{renderDocNodes(group.items)}</div>
            </section>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
