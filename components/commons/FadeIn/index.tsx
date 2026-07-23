/**
 * @component FadeIn 滚动渐入容器
 * @description 进入视口时播放渐入动画。核心修正：默认渲染为「可见」，
 *              仅在客户端挂载后、元素尚未进入视口时才隐藏（视口外，用户无感），
 *              从而彻底消除「依赖 JS 才可见」导致的白屏问题。
 *              首屏已在视口内的元素在挂载时同步渐入，无可见性跳变闪烁。
 * @author gouxinjie
 * @created 2026-07-17
 * @updated 2026-07-23 默认可见 + JS 增强，修复白屏/闪烁
 */

"use client";

import { ReactNode, CSSProperties } from "react";
import { useInView } from "@/utils/useInView";
import styles from "./index.module.scss";

/** FadeIn 组件属性 */
interface FadeInProps {
  /** 子内容 */
  children: ReactNode;
  /** 动画延迟（秒），用于多元素错落渐入 */
  delay?: number;
  /** 额外类名 */
  className?: string;
  /** 初始纵向位移（px），渐入结束归零 */
  y?: number;
  /** 视口外扩边距，等价 framer-motion 的 margin */
  margin?: string;
}

export default function FadeIn({
  children,
  delay = 0,
  className = "",
  y = 24,
  margin = "-100px 0px",
}: FadeInProps) {
  const [ref, inView, mounted] = useInView<HTMLDivElement>({ once: true, margin });

  // 未挂载（SSR/首帧）：默认可见，绝不白屏；
  // 已挂载：进入视口播放渐入动画，未进入则保持隐藏（位于视口外）
  const state = !mounted ? "visible" : inView ? "animate" : "hidden";

  const stateClass =
    state === "animate" ? styles.animate : state === "hidden" ? styles.hidden : "";

  return (
    <div
      ref={ref}
      className={`${styles.fadeIn} ${stateClass} ${className}`.trim()}
      style={
        {
          "--fade-delay": `${delay}s`,
          "--fade-y": `${y}px`,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
