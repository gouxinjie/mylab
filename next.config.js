/**
 * @file next.config.js
 * @description Next.js 配置：国际化、MDX、图片优化、HTTP 安全响应头
 * @author gouxinjie
 * @updated 2026-10-09 增加 OSS 图片域名白名单（由环境变量驱动）
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
// 是否为生产环境（生产环境才开启静态资源长缓存，避免 dev 模式缓存过期 chunk）
const isProd = process.env.NODE_ENV === "production";

/**
 * 解析 OSS 图片公网域名，生成 next/image 远程图片白名单规则
 * @description 从 NEXT_PUBLIC_OSS_BASE_URL 提取协议、主机名与可选路径前缀；
 *              未配置或格式非法时返回 null（此时图片地址自动回退为本地路径）
 * @returns {import('next').NextConfig['images']['remotePatterns'][number] | null} 白名单规则或 null
 */
const resolveOssRemotePattern = () => {
  const baseUrl = process.env.NEXT_PUBLIC_OSS_BASE_URL;
  if (!baseUrl) return null;
  try {
    const { protocol, hostname, pathname } = new URL(baseUrl);
    const normalizedPath = pathname.replace(/\/+$/, "");
    return {
      protocol: protocol.replace(":", ""),
      hostname,
      // 域名下存在路径前缀时（如 CDN 的 /img）限定范围，避免白名单过宽
      ...(normalizedPath ? { pathname: `${normalizedPath}/**` } : {}),
    };
  } catch {
    console.warn("[next.config] NEXT_PUBLIC_OSS_BASE_URL 格式非法，已忽略 OSS 图片白名单");
    return null;
  }
};

// OSS 图片域名白名单（未配置环境变量时为 null）
const ossRemotePattern = resolveOssRemotePattern();

const nextConfig = {
  // MDX 文件解析页面
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],

  // Docker 独立部署模式（输出自包含构建产物）
  output: "standalone",

  // 图片优化配置
  images: {
    // 允许 Sharp 自动将 PNG/JPG 转换为 WebP/AVIF 以减小传输体积
    formats: ["image/avif", "image/webp"],
    // 允许的远程图片域（GitHub 头像 + OSS 图片域名）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      // OSS 图片域名：由 NEXT_PUBLIC_OSS_BASE_URL 驱动，未配置时不追加
      ...(ossRemotePattern ? [ossRemotePattern] : []),
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
          "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://hm.baidu.com https://*.baidu.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob: https: https://hm.baidu.com https://*.baidu.com",
          "font-src 'self'",
          "connect-src 'self' https://api.github.com https://hm.baidu.com https://*.baidu.com",
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
        source: "/((?!_next/static|_next/image|favicon.ico|images/|logos/|data/|version.json).*)",
        headers: securityHeaders,
      },
      // 静态资源添加长期缓存（仅生产环境；dev 模式保持默认缓存策略，避免浏览器缓存过期 chunk）
      ...(isProd
        ? [
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
          ]
        : []),
    ];
  },
  // Sass 配置
  sassOptions: {
    includePaths: ["./styles"],
  },
};

module.exports = withNextIntl(withMDX(nextConfig));
