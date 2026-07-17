/**
 * @component PageBanner
 * @description 通用页头横幅组件，背景图（next/image 优化）+ 左侧文案区域，用于首页 Hero 和子页 header
 * @author gouxinjie
 * @created 2024-07-13
 * @updated 2026-07-17
 */

import Image from "next/image";
import { ReactNode } from "react";
import styles from "./index.module.scss";

/** PageBanner 组件属性 */
interface PageBannerProps {
  /** 背景图片路径（经 next/image 自动压缩/响应式优化） */
  bgImage?: string;
  /** 子内容（标签、标题、描述、按钮等） */
  children: ReactNode;
  /** 内容区最大宽度，默认 672px */
  maxWidth?: string;
  /** 外层类名，用于定制 padding 等 */
  className?: string;
  /** 底部外边距，默认 12px */
  bottomMargin?: string;
  /** 是否为首屏关键图（LCP），true 时预加载，默认 false */
  priority?: boolean;
}

/**
 * 通用页头横幅：flex 布局 + 背景图（next/image 优化）+ 左侧内容
 * @param bgImage - 背景图片路径
 * @param children - 子内容
 * @param maxWidth - 内容区最大宽度
 * @param className - 外层类名
 * @param bottomMargin - 底部外边距
 * @param priority - 是否首屏关键图
 * @returns 横幅节点
 */
export default function PageBanner({
  bgImage,
  children,
  maxWidth = "672px",
  className = "",
  bottomMargin = "12px",
  priority = false,
}: PageBannerProps) {
  return (
    <div
      className={`${styles.banner} ${className}`}
      style={{ marginBottom: bottomMargin }}
    >
      {bgImage ? (
        <div className={styles.bannerBg}>
          <Image
            src={bgImage}
            alt=""
            fill
            priority={priority}
            sizes="100vw"
            className={styles.bannerImg}
          />
        </div>
      ) : null}

      <div className={styles.banner__content} style={{ maxWidth }}>
        {children}
      </div>
    </div>
  );
}
