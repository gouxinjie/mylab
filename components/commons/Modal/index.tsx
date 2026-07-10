/**
 * @component Modal
 * @description 通用弹窗组件，支持遮罩点击关闭、ESC 关闭、背景滚动锁定
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-10
 */

"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import styles from "./index.module.scss";

/**
 * Modal 组件属性
 */
interface ModalProps {
  /** 是否打开弹窗 */
  open: boolean;
  /** 关闭弹窗回调 */
  onClose: () => void;
  /** 弹窗标题（可选） */
  title?: string;
  /** 弹窗内容 */
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  // 用 ref 保存最新的 onClose，避免父组件内联函数导致监听频繁解绑/绑定
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // 监听 ESC 关闭，并在打开时锁定背景滚动（仅依赖 open）
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          {title ? <h3 className={styles.title}>{title}</h3> : <span />}
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="关闭"
          >
            <svg
              width="20"
              height="20"
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
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
