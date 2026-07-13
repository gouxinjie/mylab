/**
 * @component PageBanner
 * @description 通用页头横幅组件，背景图 + 左侧文案区域，用于首页 Hero 和子页 header
 * @author gouxinjie
 * @created 2024-07-13
 */

import { ReactNode } from "react";
import styles from "./index.module.scss";

/**
 * PageBanner 组件 Props
 */
interface PageBannerProps {
  /** 背景图片路径 */
  bgImage: string;
  /** 子内容（标签、标题、描述、按钮等） */
  children: ReactNode;
  /** 内容区最大宽度，默认 672px */
  maxWidth?: string;
  /** 外层类名，用于定制 padding 等 */
  className?: string;
  /** 底部外边距，默认 24px */
  bottomMargin?: string;
}

/**
 * 通用页头横幅：flex 布局 + 背景图 + 左侧内容
 */
export default function PageBanner({
  bgImage,
  children,
  maxWidth = "672px",
  className = "",
  bottomMargin = "24px",
}: PageBannerProps) {
  return (
    <div
      className={`${styles.banner} ${className}`}
      style={{
        backgroundImage: `url("${bgImage}")`,
        marginBottom: bottomMargin,
      }}
    >
      <div
        className={styles.banner__content}
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
