/**
 * @file middleware.ts
 * @description Next.js 国际化中间件
 * @author gouxinjie
 * @updated 2026-07-23 优化 matcher 排除静态资源以提升性能
 */

import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // 支持的语言列表
  locales: ["zh", "en"],
  // 默认语言（中文）
  defaultLocale: "zh",
  // 根据请求头 Accept-Language 自动判断语言
  localeDetection: true,
  // 路径前缀策略：中文使用 /zh，英文使用 /en
  localePrefix: "always",
});

/**
 * 匹配器：仅对非静态资源路径应用国际化中间件
 * 排除：_next（构建产物）、images（图片资源）、logos（品牌图标）、data（静态数据）、
 *       imgs（其他图片）、favicon、api（API 路由）
 */
export const config = {
  matcher: [
    "/((?!_next|images|logos|data|imgs|favicon.ico|api|health|.*\\.png|.*\\.svg|.*\\.ico|.*\\.woff2).*)",
  ],
};
