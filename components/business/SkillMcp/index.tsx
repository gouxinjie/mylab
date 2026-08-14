/**
 * @component SkillMcp
 * @description Skill / MCP 能力资产展示组件：卡片展示，含安装命令一键复制与 GitHub 链接
 * @author gouxinjie
 * @created 2026-08-14
 */

"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { LocalizedText } from "@/lib/projects";
import type { SkillMcpItem, SkillMcpType } from "@/lib/skill-mcp";
import FadeIn from "@/components/commons/FadeIn";
import styles from "./index.module.scss";

/**
 * 根据当前语言取多语言文本
 * @param text - 多语言文本对象
 * @param locale - 当前语言（zh / en）
 * @returns 对应语言的文案
 */
const getLocalized = (text: LocalizedText, locale: string): string =>
  locale === "en" ? text.en : text.zh;

/**
 * 类型徽章图标（Skill：闪电；MCP：网络节点），描边风格
 * @param type - 能力类型
 * @returns SVG 图标节点
 */
function TypeIcon({ type }: { type: SkillMcpType }) {
  const svgProps = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "skill") {
    return (
      <svg {...svgProps}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  return (
    <svg {...svgProps}>
      <circle cx="5" cy="6" r="3" />
      <circle cx="19" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <line x1="5" y1="9" x2="12" y2="15" />
      <line x1="19" y1="9" x2="12" y2="15" />
    </svg>
  );
}

/**
 * 单个 Skill / MCP 卡片
 * @param item - Skill / MCP 条目数据
 */
function SkillMcpCard({ item }: { item: SkillMcpItem }) {
  const locale = useLocale();
  const t = useTranslations("SkillMcp");
  // 是否已复制（用于按钮反馈态，延时重置）
  const [copied, setCopied] = useState(false);

  /**
   * 复制安装命令到剪贴板
   * @description 优先使用异步剪贴板 API，失败时回退到兼容方案；复制成功后显示短暂反馈
   */
  const handleCopy = async (): Promise<void> => {
    const cmd = item.installCmd;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cmd);
      } else {
        // 兼容降级：临时 textarea + execCommand
        const textarea = document.createElement("textarea");
        textarea.value = cmd;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // 复制失败静默处理，不打断用户操作
    }
  };

  return (
    <article className={styles.card}>
      {/* 卡片头部：类型徽章 + 仓库链接 */}
      <div className={styles.card__head}>
        <span
          className={styles.card__type}
          style={{ color: item.accent, backgroundColor: `${item.accent}1f` }}
        >
          <TypeIcon type={item.type} />
          {item.type === "skill" ? t("type_skill") : t("type_mcp")}
        </span>
        <a
          href={item.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.card__repo}
          aria-label={t("labels.repo")}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
          </svg>
        </a>
      </div>

      {/* 作品名称 */}
      <h3 className={styles.card__name}>{item.name}</h3>

      {/* 简介 */}
      <p className={styles.card__brief}>{getLocalized(item.brief, locale)}</p>

      {/* 详细描述 */}
      <p className={styles.card__desc}>{getLocalized(item.description, locale)}</p>

      {/* 安装命令：一键复制 */}
      <div className={styles.card__install}>
        <code className={styles.card__cmd}>{item.installCmd}</code>
        <button
          type="button"
          className={styles.card__copy}
          style={{ color: item.accent, backgroundColor: `${item.accent}1f` }}
          onClick={handleCopy}
          aria-label={t("labels.copy")}
        >
          {copied ? t("copied") : t("copy")}
        </button>
      </div>

      {/* 技术标签 */}
      <div className={styles.card__tags}>
        {item.tags.map((tag) => (
          <span key={tag} className={styles.card__tag}>
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}

/**
 * Skill / MCP 展示模块
 * @param items - Skill / MCP 条目数据列表，由服务端组件传入
 */
export default function SkillMcp({ items }: { items: SkillMcpItem[] }) {
  const t = useTranslations("SkillMcp");

  // 按排序权重升序排列（静态数据，仅计算一次）
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <section className={styles.oss}>
      <div className="container-custom">
        {/* 模块标题区 */}
        <div className={styles.oss__head}>
          <h2 className={styles.oss__title}>{t("title")}</h2>
          <p className={styles.oss__subtitle}>{t("subtitle")}</p>
        </div>

        {/* 卡片网格 */}
        <div className={styles.oss__grid}>
          {sorted.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 0.1}>
              <SkillMcpCard item={item} />
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
