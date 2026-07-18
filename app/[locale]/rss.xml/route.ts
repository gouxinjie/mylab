/**
 * @file rss.xml/route.ts
 * @description 按语言生成 RSS 2.0 订阅源，包含全部 AI 笔记文章
 * @author gouxinjie
 * @created 2026-07-18
 */

import { NextResponse } from "next/server";
import type { Locale } from "@/i18n";
import { getSiteUrl, getAllPosts, escapeXml } from "@/lib/feed";

/**
 * 生成指定语言的 RSS 2.0 XML
 * @param locale - 语言标识
 * @returns RSS 2.0 格式 XML 字符串
 */
const buildRss = (locale: Locale): string => {
  const siteUrl = getSiteUrl();
  const posts = getAllPosts();
  const selfUrl = `${siteUrl}/${locale}/rss.xml`;
  const homeUrl = `${siteUrl}/${locale}`;
  const title = locale === "zh" ? "xinjie · AI 笔记" : "xinjie · AI Notes";
  const description =
    locale === "zh"
      ? "用代码构建价值，用 AI 探索未来。"
      : "Building value with code, exploring the future with AI.";

  const items = posts
    .map((post) => {
      const link = `${siteUrl}/${locale}/ai-notes/${post.slug}`;
      const pubDate = post.updated
        ? new Date(post.updated).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${homeUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>${locale}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${selfUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
};

/**
 * 处理 GET 请求，返回指定语言的 RSS 订阅源
 * @param _request - 请求对象（未使用）
 * @param params - 路由参数，含 locale 语言标识
 * @returns RSS XML 响应
 */
export const GET = (
  _request: Request,
  { params }: { params: { locale: string } },
): NextResponse => {
  const locale = params.locale as Locale;
  const xml = buildRss(locale);
  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
