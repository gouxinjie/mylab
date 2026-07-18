/**
 * @file feed.ts
 * @description RSS / Sitemap 生成所需的站点配置与文章元信息读取工具
 * @author gouxinjie
 * @created 2026-07-18
 */

import { getFlatDocList, getDocContent } from "@/lib/ai-docs";
import type { Locale } from "@/i18n";

/** 文章元信息（用于订阅源与站点地图） */
export interface FeedPost {
  /** 路由 slug */
  slug: string;
  /** 文档标题 */
  title: string;
  /** 更新时间（YYYY-MM-DD，可选） */
  updated?: string;
}

/** 站点支持的语言列表（与 i18n 配置保持一致） */
export const FEED_LOCALES: Locale[] = ["zh", "en"];

/**
 * 获取站点根域名（用于生成 RSS/Sitemap 的绝对链接）
 * @description 优先使用环境变量 NEXT_PUBLIC_SITE_URL，未配置时回退到默认域名。
 *              部署时请在 .env 或部署平台配置 NEXT_PUBLIC_SITE_URL 为真实域名（不含末尾斜杠）。
 * @returns 站点根 URL（不含末尾斜杠）
 */
export const getSiteUrl = (): string => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");
  return raw && raw.length > 0 ? raw : "https://www.gouxinjie.com";
};

/**
 * 获取全部 AI 笔记文档的元信息（按目录顺序）
 * @returns 文章元信息数组
 */
export const getAllPosts = (): FeedPost[] => {
  const posts: FeedPost[] = [];
  for (const item of getFlatDocList()) {
    const content = getDocContent(item.slug);
    if (content) {
      posts.push({ slug: item.slug, title: content.title, updated: content.updated });
    }
  }
  return posts;
};

/**
 * XML 特殊字符转义，防止内容破坏 XML 结构
 * @param input - 待转义字符串
 * @returns 转义后的安全字符串
 */
export const escapeXml = (input: string): string => {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
