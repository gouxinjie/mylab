import { Fragment, type ReactNode } from "react";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import FadeIn from "@/components/commons/FadeIn";
import AiTabs from "@/components/business/AiTabs";
import { Link } from "@/lib/navigation";
import { aiDocGroups, type AiDocNode } from "@/lib/ai-docs";
import { aiProducts } from "@/lib/ai-products";
import styles from "./page.module.scss";

/**
 * AIPage
 * @description AI 相关概览页：顶部 Tab 切换「AI 搜索（市面产品）」与「相关文档（分类卡片）」
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-16
 */

export const metadata: Metadata = {
  title: "AI 相关",
};

export default async function AIPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = await getTranslations("AI");
  const localeKey = locale === "zh" ? "zh" : "en";

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
          <Link key={node.slug} href={`/ai/${node.slug}`} className={styles.docCard}>
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

  // ── Tab 1：AI 搜索（市面主流产品展示） ─────────────
  const productsPanel = (
    <section className={styles.products}>
      <FadeIn>
        <header className={styles.products__head}>
          <h2 className={styles.products__title}>{t("products_title")}</h2>
          <p className={styles.products__subtitle}>{t("products_subtitle")}</p>
        </header>
      </FadeIn>

      <div className={styles.productGrid}>
        {aiProducts.map((product, idx) => (
          <FadeIn key={product.name} delay={0.04 * (idx % 6)}>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.product}
            >
              {/* 产品头像：取名称首字母 */}
              <span
                className={styles.product__logo}
                style={{ backgroundColor: product.accent }}
                aria-hidden="true"
              >
                {product.name.charAt(0)}
              </span>

              <div className={styles.product__body}>
                <div className={styles.product__top}>
                  <span className={styles.product__name}>{product.name}</span>
                  <span className={styles.product__cat}>
                    {product.category[localeKey]}
                  </span>
                </div>
                <p className={styles.product__desc}>
                  {product.desc[localeKey]}
                </p>
              </div>

              <span className={styles.product__visit}>
                {t("visit")}
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </span>
            </a>
          </FadeIn>
        ))}
      </div>
    </section>
  );

  // ── Tab 2：相关文档（分类卡片网格，无侧边栏） ─────
  const docsPanel = (
    <div className={styles.home}>
      {/* 首页头部：介绍 + 开始阅读 */}
      <FadeIn>
        <header className={styles.hero}>
          <span className={styles.hero__badge}>AI DOCS</span>
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

  return (
    <AiTabs
      tabs={[
        { key: "products", label: t("tab_products"), content: productsPanel },
        { key: "docs", label: t("tab_docs"), content: docsPanel },
      ]}
    />
  );
}
