/**
 * @component Section
 * @description 通用内容区块容器：统一「标题 + 副标题 + 右侧操作区」的头部布局与版心约束，供关于页等页面复用
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-15
 */

import type { ReactNode } from "react";
import styles from "./index.module.scss";

/** Section 组件属性 */
interface SectionProps {
  /** 区块锚点 id，用于页面内跳转定位 */
  id?: string;
  /** 区块标题（支持传入 ReactNode，如需要自定义标题节点） */
  title?: ReactNode;
  /** 区块副标题，展示在标题下方 */
  subtitle?: ReactNode;
  /** 标题右侧操作区（如「查看全部」链接、按钮等） */
  action?: ReactNode;
  /** 区块主体内容 */
  children: ReactNode;
  /** 自定义最外层 section 的 className，用于额外布局控制 */
  className?: string;
}

/**
 * 通用内容区块容器
 * @param id - 锚点 id
 * @param title - 区块标题
 * @param subtitle - 区块副标题
 * @param action - 右侧操作区
 * @param children - 区块内容
 * @param className - 自定义类名
 */
export default function Section({
  id,
  title,
  subtitle,
  action,
  children,
  className,
}: SectionProps) {
  const hasHeader = Boolean(title || subtitle || action);

  return (
    <section
      id={id}
      className={`${styles.section}${className ? ` ${className}` : ""}`}
    >
      <div className="container-custom">
        {hasHeader && (
          <div className={styles.header}>
            <div className={styles.header__text}>
              {title && <h2 className={styles.header__title}>{title}</h2>}
              {subtitle && (
                <p className={styles.header__subtitle}>{subtitle}</p>
              )}
            </div>
            {action && <div className={styles.header__action}>{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
