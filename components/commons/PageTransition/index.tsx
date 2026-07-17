/**
 * @component PageTransition
 * @description 页面切换动画组件，路由变化时滚动到顶部（轻量 CSS 实现，替代 framer-motion）
 * @author gouxinjie
 * @created 2024
 * @updated 2026-07-17
 */

"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";
import styles from "./index.module.scss";

/** PageTransition 组件属性 */
interface PageTransitionProps {
  /** 子内容（页面内容） */
  children: ReactNode;
}

/**
 * 页面切换容器：通过 key={pathname} 在路由变化时重挂载触发 CSS 入场动画，并滚动到顶部
 * @param children - 子内容
 * @returns 带切换动画的容器节点
 */
export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // 路由切换或页面首次加载时滚动到顶部（绘制前执行，避免闪烁）
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className={styles.pageTransition}>
      {children}
    </div>
  );
}
