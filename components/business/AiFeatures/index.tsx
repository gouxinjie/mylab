"use client";

/**
 * @component AiFeatures
 * @description AI 页面底部特性模块：安全可靠、高效便捷、持续更新
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-16
 */

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";

/**
 * 特性图标类型
 */
type FeatureIcon = "shield" | "lightning" | "star";

/**
 * 单个特性项数据
 */
interface FeatureItem {
  /** 图标标识 */
  icon: FeatureIcon;
  /** 翻译键（标题 / 描述） */
  key: string;
}

/**
 * 特性图标映射：使用 SVG 保证清晰度与主题一致
 * @param icon - 图标类型
 * @returns SVG 图标组件
 */
const FeatureIcon = ({ icon }: { icon: FeatureIcon }) => {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (icon) {
    case "shield":
      return (
        <svg {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 12 15 16 10" />
        </svg>
      );
    case "lightning":
      return (
        <svg {...commonProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case "star":
      return (
        <svg {...commonProps}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      );
    default:
      return null;
  }
};

/**
 * 特性项固定顺序
 */
const features: FeatureItem[] = [
  { icon: "shield", key: "safe" },
  { icon: "lightning", key: "efficient" },
  { icon: "star", key: "updated" },
];

/**
 * AI 页面特性模块
 * @returns 三列特性卡片
 */
const AiFeatures = () => {
  const t = useTranslations("AI.features");

  return (
    <ul className={styles.features}>
      {features.map((item) => (
        <li key={item.key} className={styles.item}>
          <span className={styles.iconWrap}>
            <FeatureIcon icon={item.icon} />
          </span>
          <div className={styles.text}>
            <h3 className={styles.title}>{t(`${item.key}.title`)}</h3>
            <p className={styles.desc}>{t(`${item.key}.description`)}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default AiFeatures;
