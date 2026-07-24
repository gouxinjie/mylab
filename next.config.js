/**
 * @file next.config.js
 * @description Next.js 配置：国际化、MDX、图片优化、HTTP 安全响应头
 * @author gouxinjie
 * @updated 2026-07-23 添加安全响应头与图片格式优化
 */

const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts");
const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // MDX 文件解析页面
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  // Docker 独立部署模式（输出自包含构建产物）
  output: "standalone",

  // 图片优化配置
  images: {
    // 允许 Sharp 自动将 PNG/JPG 转换为 WebP/AVIF 以减小传输体积
    formats: ["image/avif", "image/webp"],
    // 允许的远程图片域（GitHub 头像）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },

  /**
   * HTTP 安全响应头
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/headers
   */
  async headers() {
    const securityHeaders = [
      // 内容安全策略：允许自身资源与常见 CDN
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https:",
          "font-src 'self'",
          "connect-src 'self' https://api.github.com",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
      // 禁止浏览器推断 MIME 类型
      {
        key: "X-Content-Type-Options",
        value: "nosniff",
      },
      // 禁止被嵌入 iframe
      {
        key: "X-Frame-Options",
        value: "DENY",
      },
      // 增强 XSS 防护
      {
        key: "X-XSS-Protection",
        value: "1; mode=block",
      },
      // 限制 Referer 信息传递
      {
        key: "Referrer-Policy",
        value: "strict-origin-when-cross-origin",
      },
      // 权限策略：仅允许必要浏览器特性
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ];

    return [
      {
        source: "/((?!_next/static|_next/image|favicon.ico|images/|logos/|data/).*)",
        headers: securityHeaders,
      },
      // 静态资源添加长期缓存
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, must-revalidate",
          },
        ],
      },
    ];
  },
  // Sass 配置
  sassOptions: {
    includePaths: ["./styles"],
  },
};

module.exports = withNextIntl(withMDX(nextConfig));
