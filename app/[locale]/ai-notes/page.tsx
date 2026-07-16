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

/**
 * 渲染分组标题图标（描边风格，22×22）
 * @param type - 图标类型标识
 * @returns SVG 图标节点
 */
function GroupIcon({ type }: { type: string }) {
  const svgProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (type) {
    case "bookOpen":
      return (
        <svg {...svgProps}>
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      );
    case "wrench":
      return (
        <svg {...svgProps}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * 渲染卡片彩色图标底板（圆角方块 + 白色图标）
 * @param type - 图标类型标识
 * @param color - 底板背景色
 * @returns 带底板的图标节点
 */
function ColorIcon({ type, color }: { type: string; color: string }) {
  const svgProps = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "white",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  let icon: ReactNode = null;
  switch (type) {
    case "robot":
      icon = (
        <svg {...svgProps}>
          <rect x="3" y="11" width="18" height="10" rx="2" />
          <circle cx="12" cy="5" r="2" />
          <path d="M12 7v4" />
          <path d="M8 15h.01" />
          <path d="M16 15h.01" />
        </svg>
      );
      break;
    case "database":
      icon = (
        <svg {...svgProps}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14a9 3 0 0 0 18 0V5" />
          <path d="M3 12a9 3 0 0 0 18 0" />
        </svg>
      );
      break;
    case "terminal":
      icon = (
        <svg {...svgProps}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      );
      break;
    case "search":
      icon = (
        <svg {...svgProps}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
      break;
    case "network":
      icon = (
        <svg {...svgProps}>
          <circle cx="5" cy="6" r="3" />
          <circle cx="19" cy="6" r="3" />
          <circle cx="12" cy="18" r="3" />
          <line x1="5" y1="9" x2="12" y2="15" />
          <line x1="19" y1="9" x2="12" y2="15" />
        </svg>
      );
      break;
    case "layers":
      icon = (
        <svg {...svgProps}>
          <polygon points="12 2 2 7 12 12 22 7 12 2" />
          <polyline points="2 17 12 22 22 17" />
          <polyline points="2 12 12 17 22 12" />
        </svg>
      );
      break;
    case "fileText":
      icon = (
        <svg {...svgProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
      break;
    case "code":
      icon = (
        <svg {...svgProps}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
      break;
    case "server":
      icon = (
        <svg {...svgProps}>
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
        </svg>
      );
      break;
    case "zap":
      icon = (
        <svg {...svgProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
      break;
  }

  if (!icon) {
    return null;
  }

  return (
    <span
      className={styles.iconBox}
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {icon}
    </span>
  );
}

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
      // 可点击文档：渲染为图标卡片
      if (node.slug) {
        return (
          <Link
            key={node.slug}
            href={`/ai-notes/${node.slug}`}
            className={styles.docCard}
          >
            <div className={styles.docCard__main}>
              {node.icon && node.iconColor && (
                <ColorIcon type={node.icon} color={node.iconColor} />
              )}
              <div className={styles.docCard__text}>
                <span className={styles.docCard__title}>{node.text}</span>
                {node.desc && (
                  <span className={styles.docCard__desc}>{node.desc}</span>
                )}
              </div>
            </div>
            <span className={styles.docCard__arrow}>
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
              {/* 分组标题：图标 + 标题 + 描述 */}
              <div className={styles.docGroup__header}>
                {group.icon && group.iconColor && (
                  <span
                    className={styles.docGroup__icon}
                    style={{ color: group.iconColor }}
                  >
                    <GroupIcon type={group.icon} />
                  </span>
                )}
                <h2 className={styles.docGroup__title}>{group.text}</h2>
                {group.desc && (
                  <span className={styles.docGroup__desc}>{group.desc}</span>
                )}
              </div>
              <div className={styles.docGrid}>
                {renderDocNodes(group.items)}
              </div>
            </section>
          </FadeIn>
        ))}
      </div>
    </div>
  );
}
