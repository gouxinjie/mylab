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
import {
  aiProducts,
  aiRegionLabels,
  aiCategoryLabels,
  categoryOrder,
  type AiCategory,
  type AiProduct,
} from "@/lib/ai-products";
import styles from "./index.module.scss";

/**
 * 根据产品官网地址生成对应的 favicon 地址（DuckDuckGo 图标服务，按域名取真实图标）
 * @param url - 产品官方网站地址
 * @returns favicon 图片地址；地址非法时返回空串
 */
const getFavicon = (url: string): string => {
  try {
    const host = new URL(url).hostname;
    return `https://icons.duckduckgo.com/ip3/${host}.ico`;
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
  // 仅支持 6 位十六进制，非法时回退白色
  if (clean.length !== 6) return "#fff";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  // 相对亮度（感知加权）：>0.6 视为亮底，用深色文字
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#fff";
};

/**
 * 产品图标：固定 44px 包裹层，内部优先展示官网 favicon，
 * 加载失败时回退到品牌色首字母方块
 * @param product - 单个 AI 产品
 */
const ProductLogo = ({ product }: { product: AiProduct }) => {
  const [errored, setErrored] = useState(false);
  const favicon = getFavicon(product.url);
  // 仅当 favicon 有效且未加载失败时才展示图片
  const showImg = !errored && !!favicon;

  return (
    <span
      className={styles.logo}
      // 回退到首字母时显示品牌色底，并按底色亮度选择文字色；图片模式下不设置背景
      style={
        showImg
          ? { backgroundColor: "transparent" }
          : { backgroundColor: product.accent, color: getReadableTextColor(product.accent) }
      }
      aria-hidden="true"
    >
      {showImg ? (
        <img
          className={styles.logoImg}
          src={favicon}
          alt={`${product.name} logo`}
          loading="lazy"
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
 * @returns 搜索框、分类 Tab 与按条件过滤的产品网格
 */
const AiProducts = () => {
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
            aria-label="清除搜索"
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
          {list.map((product) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.product}
            >
              {/* 卡片头部：官网 favicon + 名称/分类，横向排列 */}
              <div className={styles.header}>
                <ProductLogo product={product} />
                <div className={styles.headerText}>
                  <div className={styles.top}>
                    <span className={styles.name}>{product.name}</span>
                    <span className={styles.cat}>
                      {aiCategoryLabels[product.category][localeKey]}
                    </span>
                  </div>
                </div>
              </div>

              <p className={styles.desc}>{product.desc[localeKey]}</p>

              {/* 卡片底部：左侧国内/国外标签 + 右侧访问入口 */}
              <div className={styles.footer}>
                <span className={styles.region}>
                  {aiRegionLabels[product.region][localeKey]}
                </span>
                <span className={styles.visit}>
                  {t("visit")}
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
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        // 无匹配结果时的空状态
        <p className={styles.empty}>{t("empty")}</p>
      )}
    </div>
  );
};

export default AiProducts;
