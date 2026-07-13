/**
 * @component PageTransition
 * @description 页面切换动画组件，路由变化时滚动到顶部
 * @author gouxinjie
 * @created 2024
 * @updated 2026-07-13
 */

"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode, useLayoutEffect } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeInOut" as const,
  duration: 0.25,
};

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  // 路由切换或页面首次加载时滚动到顶部（绘制前执行，避免闪烁）
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      initial="initial"
      animate="in"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}
