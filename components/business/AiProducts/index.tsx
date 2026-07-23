"use client";

/**
 * @component AiProducts
 * @description AI 产品展示组件：搜索框 + 分类 Tab 切换 + 产品卡片网格（客户端交互）
 * @author gouxinjie
 * @created 2026-07-16
 * @updated 2026-07-16
 */

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { AiCategory, AiProduct, AiRegion, I18nText } from "@/lib/ai-products";
import Image from "next/image";
import styles from "./index.module.scss";

/**
 * 根据产品数据获取品牌图标地址（本地静态资源，按域名映射）
 * 优先使用产品自定义 logo，否则按官网域名映射到 public/logos/<域名>.png；
 * 若对应图标文件不存在，<img> 触发 onError 回退到首字母头像。
 * 注：图标由 scripts/fetch-logos.mjs 从 Google favicon 服务批量下载后自托管，
 * 运行时完全不依赖外网，规避国内无法访问外部图标服务的问题。
 * @param product - 单个 AI 产品
 * @returns 图标图片地址；无法获取时返回空串
 */
const getLogoUrl = (product: AiProduct): string => {
  // 优先使用产品自定义 logo
  if (product.logo) return product.logo;
  // 否则按官网域名映射到本地静态资源
  try {
    const domain = new URL(product.url).hostname;
    return `/logos/${domain}.png`;
  } catch {
    return "";
  }
};

/**
 * 根据十六进制底色推算合适的文字颜色（亮底用深色，暗底用白色）
 * @param hex - 形如 #RRGGBB 的颜色值
 * @returns 可读性更优的文字颜色
 */
const getReadableTextColor = (hex: string): string => {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return "#fff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#fff";
};

/**
 * 产品图标：优先品牌图标，加载失败回退到首字母头像
 * @param product - 单个 AI 产品
 */
const ProductLogo = ({ product }: { product: AiProduct }) => {
  const [errored, setErrored] = useState(false);
  const logoUrl = getLogoUrl(product);
  const showImg = !errored && !!logoUrl;

  return (
    <span
      className={styles.logo}
      style={
        showImg
          ? { backgroundColor: "transparent" }
          : { backgroundColor: product.accent, color: getReadableTextColor(product.accent) }
      }
      aria-hidden="true"
    >
      {showImg ? (
        <Image
          className={styles.logoImg}
          src={logoUrl}
          alt={`${product.name} logo`}
          width={48}
          height={48}
          loading="lazy"
          unoptimized={logoUrl.endsWith(".svg")}
          onError={() => setErrored(true)}
        />
      ) : (
        product.name.charAt(0)
      )}
    </span>
  );
};

/**
 * AI 产品展示（搜索 + 分类 Tab 过滤）
 * @param aiProducts - AI 产品数据列表，由服务端组件传入
 * @param aiRegionLabels - 区域标签映射表
 * @param aiCategoryLabels - 分类标签映射表
 * @param categoryOrder - 分类排序数组
 * @returns 搜索框、分类 Tab 与按条件过滤的产品网格
 */
const AiProducts = ({
  aiProducts,
  aiRegionLabels,
  aiCategoryLabels,
  categoryOrder,
}: {
  /** AI 产品数据列表 */
  aiProducts: AiProduct[];
  /** 区域标签映射 */
  aiRegionLabels: Record<AiRegion, I18nText>;
  /** 分类标签映射 */
  aiCategoryLabels: Record<AiCategory | "all", I18nText>;
  /** 分类排序数组 */
  categoryOrder: (AiCategory | "all")[];
}) => {
  // 当前语言（zh / en）
  const locale = useLocale();
  const localeKey = locale === "zh" ? "zh" : "en";
  // 当前选中的分类 Tab，默认「全部」
  const [active, setActive] = useState<"all" | AiCategory>("all");
  // 搜索关键词
  const [search, setSearch] = useState("");
  // AI 区块双语文案
  const t = useTranslations("AI");

  // 先按分类过滤，再按关键词（名称 + 中英文简介）过滤
  const list = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return aiProducts.filter((product) => {
      if (active !== "all" && product.category !== active) return false;
      if (!kw) return true;
      return (
        product.name.toLowerCase().includes(kw) ||
        product.desc.zh.toLowerCase().includes(kw) ||
        product.desc.en.toLowerCase().includes(kw)
      );
    });
  }, [active, search]);

  return (
    <div className={styles.wrap}>
      {/* 搜索框：按名称或简介实时过滤 */}
      <div className={styles.search}>
        <svg
          className={styles.searchIcon}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("search_placeholder")}
          className={styles.searchInput}
          aria-label={t("search_placeholder")}
        />
        {search && (
          <button
            type="button"
            className={styles.searchClear}
            onClick={() => setSearch("")}
            aria-label={t("search_clear")}
          >
            ×
          </button>
        )}
      </div>

      {/* 分类 Tab 切换栏 */}
      <div className={styles.tabs} role="tablist" aria-label="AI 产品分类">
        {categoryOrder.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={active === key}
            className={`${styles.tab} ${active === key ? styles.tabActive : ""}`}
            onClick={() => setActive(key)}
          >
            {aiCategoryLabels[key][localeKey]}
          </button>
        ))}
      </div>

      {/* 产品卡片网格 */}
      {list.length > 0 ? (
        <div className={styles.grid}>
          {list.map((product) => {
            // 右上角标记：优先使用 badge，否则回退到公司名
            const badgeText = product.badge ?? product.company;
            return (
              <a
                key={`${product.url}-${product.name}`}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.product}
              >
                {/* 卡片右下角装饰性半圆阴影 */}
                <span
                  className={styles.glow}
                  aria-hidden="true"
                  style={{
                    background: `radial-gradient(circle at 50% 25%, ${product.accent}22 0%, ${product.accent}14 50%, ${product.accent}04 78%, transparent 82%)`,
                  }}
                />
                {/* 卡片头部：左侧 Logo + 右侧标记 */}
                <div className={styles.header}>
                  <ProductLogo product={product} />
                  <span
                    className={styles.badge}
                    style={{
                      color: product.accent,
                      backgroundColor: `${product.accent}1f`,
                    }}
                  >
                    {badgeText[localeKey]}
                  </span>
                </div>

                {/* 产品名称 */}
                <span className={styles.name}>{product.name}</span>

                {/* 所属公司（品牌色） */}
                <span
                  className={styles.company}
                  style={{ color: product.accent }}
                >
                  {product.company[localeKey]}
                </span>

                {/* 产品简介 */}
                <p className={styles.desc}>{product.desc[localeKey]}</p>

                {/* 功能标签 */}
                {product.tags && product.tags.length > 0 && (
                  <div className={styles.tags}>
                    {product.tags.map((tag, i) => (
                      <span
                        key={`${product.name}-tag-${i}`}
                        className={styles.tag}
                        style={{
                          color: product.accent,
                          backgroundColor: `${product.accent}1f`,
                        }}
                      >
                        {tag[localeKey]}
                      </span>
                    ))}
                  </div>
                )}

                {/* 卡片底部：区域 + 访问官网按钮 */}
                <div className={styles.footer}>
                  <span className={styles.region}>
                    {/* 地球图标 */}
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="2" y1="12" x2="22" y2="12" />
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                    </svg>
                    {aiRegionLabels[product.region][localeKey]}
                  </span>
                  <span
                    className={styles.visit}
                    style={{
                      color: product.accent,
                      backgroundColor: `${product.accent}1f`,
                    }}
                  >
                    {t("visit")}
                    {/* 外链箭头 */}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M7 17L17 7" />
                      <path d="M7 7h10v10" />
                    </svg>
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      ) : (
        // 无匹配结果时的空状态
        <p className={styles.empty}>{t("empty")}</p>
      )}
    </div>
  );
};

export default AiProducts;
