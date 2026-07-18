/**
 * @file sitemap.xml/route.ts
 * @description 生成站点地图，包含核心页面与全部文章，并用 hreflang 标注中英文版本
 * @author gouxinjie
 * @created 2026-07-18
 */

import { NextResponse } from "next/server";
import { getSiteUrl, getAllPosts, FEED_LOCALES } from "@/lib/feed";

/** 静态核心页面路径（不含语言前缀） */
const STATIC_PATHS = ["", "/about", "/projects", "/contact", "/ai", "/ai-notes"];

/**
 * 为一组交替语言链接生成 <xhtml:link rel="alternate"> 片段
 * @param basePath - 不含语言前缀的路径
 * @returns 交替链接 XML 片段
 */
const buildAlternates = (basePath: string): string => {
  const siteUrl = getSiteUrl();
  const langLinks = FEED_LOCALES.map(
    (loc) =>
      `    <xhtml:link rel="alternate" hreflang="${loc}" href="${siteUrl}/${loc}${basePath}" />`,
  ).join("\n");
  const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/${FEED_LOCALES[0]}${basePath}" />`;
  return `${langLinks}\n${xDefault}`;
};

/**
 * 生成站点地图 XML（含 hreflang 交替链接）
 * @returns sitemap 格式 XML 字符串
 */
const buildSitemap = (): string => {
  const siteUrl = getSiteUrl();
  const defaultLocale = FEED_LOCALES[0];
  const posts = getAllPosts();

  // 核心静态页面
  const staticUrls = STATIC_PATHS.map((path) => {
    return `  <url>
    <loc>${siteUrl}/${defaultLocale}${path}</loc>
${buildAlternates(path)}
  </url>`;
  }).join("\n");

  // 文章详情页
  const postUrls = posts
    .map((post) => {
      const basePath = `/ai-notes/${post.slug}`;
      const lastmod = post.updated ? `    <lastmod>${post.updated}</lastmod>` : "";
      return `  <url>
    <loc>${siteUrl}/${defaultLocale}${basePath}</loc>
${buildAlternates(basePath)}
${lastmod}
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticUrls}
${postUrls}
</urlset>`;
};

/**
 * 处理 GET 请求，返回站点地图（同时覆盖 /zh/sitemap.xml 与 /en/sitemap.xml）
 * @returns sitemap XML 响应
 */
export const GET = (): NextResponse => {
  const xml = buildSitemap();
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
