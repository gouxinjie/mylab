/**
 * @component FadeIn
 * @description 元素渐入动画组件（基于 IntersectionObserver 的轻量实现，替代 framer-motion）
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-17
 */

"use client";

import { ReactNode } from "react";
import { useInView } from "@/utils/useInView";
import styles from "./index.module.scss";

/** FadeIn 组件属性 */
interface FadeInProps {
  /** 子内容 */
  children: ReactNode;
  /** 渐入延迟（秒） */
  delay?: number;
  /** 额外类名 */
  className?: string;
  /** 初始 Y 轴偏移像素，营造从下往上渐入效果 */
  y?: number;
  /** IntersectionObserver rootMargin，默认 "-100px 0px" */
  margin?: string;
}

/**
 * 渐入动画容器：元素进入视口后由 opacity:0/y 偏移渐显到原位
 * @param children - 子内容
 * @param delay - 渐入延迟（秒）
 * @param className - 额外类名
 * @param y - 初始 Y 轴偏移（像素）
 * @returns 带渐入行为的容器节点
 */
export default function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 24,
  margin = "-100px 0px",
}: FadeInProps) {
  const [ref, inView] = useInView<HTMLDivElement>({ once: true, margin });

  return (
    <div
      ref={ref}
      className={`${styles.fadeIn} ${inView ? styles.visible : ""} ${className}`}
      style={
        {
          "--fade-delay": `${delay}s`,
          "--fade-y": `${y}px`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
