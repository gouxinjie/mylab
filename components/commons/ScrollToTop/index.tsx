/**
 * @component ScrollToTop
 * @description 页面右下角浮动"回到顶部"按钮，滚动超过 300px 时出现，点击平滑回到顶部
 * @author gouxinjie
 * @created 2026-07-20
 * @updated 2026-07-20
 */

"use client";

import { useEffect, useState } from "react";
import styles from "./index.module.scss";

/**
 * 浮动"回到顶部"按钮
 * 仅当页面滚动超过阈值时显示，并执行平滑滚动
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /** 监听滚动事件，控制按钮显示/隐藏 */
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // 初始化时检查一次滚动位置
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /** 平滑回到页面顶部 */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      className={`${styles.btn} ${visible ? styles["btn--visible"] : ""}`}
      onClick={scrollToTop}
      aria-label="回到顶部"
      title="回到顶部"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m18 15-6-6-6 6" />
      </svg>
    </button>
  );
}
