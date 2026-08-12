/**
 * @component Services
 * @description "我能做什么" 区域组件：六张主题色卡片 + 点阵装饰
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-08-12 一比一还原设计稿：主题色卡片 + 要点列表 + 点阵装饰
 */

import { useTranslations } from "next-intl";
import FadeIn from "@/components/commons/FadeIn";
import styles from "./index.module.scss";

/**
 * 服务项图标键
 */
type ServiceIconKey =
  | "code"
  | "palette"
  | "zap"
  | "chart"
  | "sparkles"
  | "rocket";

/**
 * 服务项数据结构（来自 i18n）
 */
interface ServiceItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  number: string;
  features: string[];
}

/**
 * 主题色键 → 用于驱动每张卡片的强调色
 */
type ServiceColorKey = "green" | "blue" | "purple" | "indigo" | "orange" | "teal";

/**
 * 通用 SVG 属性：保证 6 张卡片图标视觉一致
 */
const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/**
 * 服务图标映射：基于 lucide 风格线型图标，统一 24×24
 */
const iconMap: Record<ServiceIconKey, JSX.Element> = {
  code: (
    <svg {...svgProps}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  chart: (
    <svg {...svgProps}>
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="18" y1="20" x2="18" y2="10" />
    </svg>
  ),
  sparkles: (
    <svg {...svgProps}>
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
    </svg>
  ),
  rocket: (
    <svg {...svgProps}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  zap: (
    <svg {...svgProps}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  palette: (
    <svg {...svgProps}>
      <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.062a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
};

/**
 * 圆形勾选图标（卡片要点列表专用）
 */
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/**
 * 右下角圆形箭头按钮图标
 */
const ArrowUpRightIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

/**
 * 服务区块主组件
 * @returns 顶部标题 + 6 张主题色卡片网格
 */
export default function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as ServiceItem[];

  return (
    <section className={styles.services}>
      <div className={styles.container}>
        {/* 顶部标题区：左侧标题+副标题（带绿色下划线），右上角点阵装饰 */}
        <FadeIn className={styles.header}>
          <div className={styles.header__left}>
            <h2 className={styles.header__title}>{t("title")}</h2>
            <p className={styles.header__subtitle}>{t("subtitle")}</p>
          </div>
          <div className={styles.header__dots} aria-hidden="true">
            {Array.from({ length: 56 }).map((_, i) => (
              <span key={i} className={styles.header__dot} />
            ))}
          </div>
        </FadeIn>

        {/* 6 张服务卡片：移动端单列、≥640px 两列、≥1024px 三列 */}
        <div className={styles.grid}>
          {items.map((item, idx) => {
            const Icon =
              iconMap[item.icon as ServiceIconKey] || iconMap.code;
            const colorKey = (item.color as ServiceColorKey) || "green";
            return (
              <FadeIn
                key={item.title}
                className={`${styles.item} ${styles[`item--${colorKey}`]}`}
                delay={idx * 0.08}
              >
                <div className={styles.item__top}>
                  {/* 圆形彩色图标盒 */}
                  <div className={styles.item__iconCircle}>
                    <span className={styles.item__iconInner}>{Icon}</span>
                  </div>
                  {/* 右上角编号 */}
                  <span className={styles.item__number}>{item.number}</span>
                </div>

                <h3 className={styles.item__title}>{item.title}</h3>
                <p className={styles.item__desc}>{item.description}</p>

                {/* 要点 bullet 列表 */}
                <ul className={styles.item__features}>
                  {item.features.map((feature) => (
                    <li key={feature} className={styles.item__featureItem}>
                      <span className={styles.item__check}>
                        <CheckIcon />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* 右下角跳转按钮 */}
                <button
                  type="button"
                  className={styles.item__arrow}
                  aria-label={`查看 ${item.title} 详情`}
                >
                  <ArrowUpRightIcon />
                </button>

                {/* 卡片底部彩色波浪装饰 */}
                <svg
                  className={styles.item__wave}
                  viewBox="0 0 320 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M0 28 C 40 8, 80 38, 120 22 S 200 6, 240 24 S 320 14, 320 14 L 320 40 L 0 40 Z"
                    fill="currentColor"
                  />
                </svg>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
