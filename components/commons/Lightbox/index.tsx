/**
 * @component Lightbox
 * @description 公共图片放大预览（灯箱）：点击遮罩/关闭按钮关闭，按图片原始比例自适应铺满视口
 * @author gouxinjie
 * @created 2026-07-21
 * @updated 2026-07-21
 */

"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/scrollLock";
import styles from "./index.module.scss";

/**
 * Lightbox 组件属性
 */
interface LightboxProps {
  /** 是否打开 */
  open: boolean;
  /** 图片地址 */
  src: string;
  /** 图片替代文本（可选） */
  alt?: string;
  /** 关闭回调 */
  onClose: () => void;
}

/**
 * 公共图片放大预览组件（灯箱）
 * @param open - 是否打开
 * @param src - 图片地址
 * @param alt - 替代文本
 * @param onClose - 关闭回调
 * @returns 全屏图片预览层（通过 portal 挂载到 body）
 */
export default function Lightbox({ open, src, alt, onClose }: LightboxProps) {
  // 用 ref 持有最新的 onClose，保证 ESC 监听依赖稳定（避免每次渲染重建）
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 打开时：监听 ESC 关闭 + 锁定背景滚动
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        // 捕获阶段执行：若当前灯箱位于其它弹窗之上，阻断 ESC 穿透到下层弹窗
        event.stopImmediatePropagation();
        onCloseRef.current();
      }
    };
    // 捕获阶段监听，先于冒泡阶段的弹窗 ESC 监听执行
    document.addEventListener("keydown", handleKeyDown, true);
    lockBodyScroll();

    return () => {
      document.removeEventListener("keydown", handleKeyDown, true);
      unlockBodyScroll();
    };
  }, [open]);

  // 未打开时不渲染（同时保证 SSR 阶段不调用 createPortal）
  if (!open) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onCloseRef.current}>
      {/* 关闭按钮 */}
      <button
        type="button"
        className={styles.close}
        onClick={onCloseRef.current}
        aria-label="关闭"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* 大图：按原始比例自适应铺满视口（object-fit: contain 保持比例不裁剪） */}
      <img
        src={src}
        alt={alt}
        className={styles.img}
        // 阻止点击图片本身时冒泡触发遮罩关闭
        onClick={(event) => event.stopPropagation()}
      />
    </div>,
    document.body
  );
}
