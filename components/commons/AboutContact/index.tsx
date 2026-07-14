/**
 * @component AboutContact
 * @description 关于页「与我相关」区块：链接跳转 + 复制文案（客户端组件）
 * @author gouxinjie
 * @created 2025-07-14
 * @updated 2025-07-14
 */

"use client";

import { useState } from "react";
import type { ContactLink } from "@/lib/data";
import styles from "./index.module.scss";

interface AboutContactProps {
  /** 联系方式列表 */
  links: ContactLink[];
  /** 当前语言（zh / en），用于切换描述文案 */
  locale: string;
  /** 复制提示文案 */
  copyHint: string;
  /** 复制成功文案 */
  copySuccess: string;
  /** 复制失败文案 */
  copyFail: string;
}

/**
 * 关于页联系方式组件
 * @param links - 联系方式数据
 * @param copyHint - 复制提示
 * @param copySuccess - 复制成功提示
 * @param copyFail - 复制失败提示
 * @returns 链接卡片 / 可复制卡片列表
 */
export default function AboutContact({ links, locale, copyHint, copySuccess, copyFail }: AboutContactProps) {
  // 记录当前已复制的卡片 name，用于展示临时反馈
  const [copied, setCopied] = useState<string | null>(null);

  // 复制文本到剪贴板，并展示结果反馈
  const handleCopy = async (text: string, name: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(name);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      window.alert(`${copyFail}：${text}`);
    }
  };

  return (
    <div className={styles.grid}>
      {links.map((link) => {
        const desc = locale === "zh" ? link.desc : link.descEn;
        if (link.type === "copy" && link.value) {
          return (
            <button
              key={link.name}
              type="button"
              className={styles.card}
              onClick={() => handleCopy(link.value as string, link.name)}
            >
              <span className={styles.card__icon}>{link.icon}</span>
              <div className={styles.card__text}>
                <div className={styles.card__name}>{link.name}</div>
                <div className={styles.card__desc}>{desc}</div>
              </div>
              <span className={styles.card__action}>
                {copied === link.name ? copySuccess : copyHint}
              </span>
            </button>
          );
        }

        return (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <span className={styles.card__icon}>{link.icon}</span>
            <div className={styles.card__text}>
              <div className={styles.card__name}>{link.name}</div>
              <div className={styles.card__desc}>{desc}</div>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={styles.card__arrow}
            >
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        );
      })}
    </div>
  );
}
