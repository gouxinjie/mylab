/**
 * @component PageBanner
 * @description 通用页头横幅组件，背景图（next/image 优化）+ 左侧文案区域，用于首页 Hero 和子页 header
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-17
 */

import Image from "next/image";
import { ReactNode } from "react";
import { isOssProcessed, ossImageUrl } from "@/utils/oss";
import styles from "./index.module.scss";

/**
 * 背景图输出宽度
 * @description 横幅为全宽展示，1920 已覆盖常见桌面端；
 *              由 OSS 端缩放输出，体积约 10KB，无需再按断点区分
 */
const BANNER_IMAGE_WIDTH = 1920;

/** PageBanner 组件属性 */
interface PageBannerProps {
  /** 背景图片路径（本地 /images 路径或 OSS 地址，组件内部按需转换为 OSS 处理地址） */
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
  // 交由 OSS 完成缩放与转码后浏览器直连 OSS，避免经 next/image 在应用服务器上实时转码
  const bannerSrc = bgImage ? ossImageUrl(bgImage, { width: BANNER_IMAGE_WIDTH }) : "";

  return (
    <div
      className={`${styles.banner} ${className}`}
      style={{ marginBottom: bottomMargin }}
    >
      {bannerSrc ? (
        <div className={styles.bannerBg}>
          <Image
            src={bannerSrc}
            alt=""
            fill
            priority={priority}
            // 已由 OSS 处理过的地址跳过 next/image 优化，避免二次转码
            unoptimized={isOssProcessed(bannerSrc)}
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
