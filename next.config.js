const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 实验性：对图标库做按需导入优化，减小客户端 bundle（Next 已默认覆盖部分库，此处显式声明）
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // 生产构建移除 console，仅保留 error/warn，符合日志规范
  compiler: {
    removeConsole: {
      exclude: ['error', 'warn'],
    },
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "mixins.scss";`,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "img.shields.io",
      },
    ],
    // 技术徽章为远程 SVG（shields.io），需允许 SVG 资源；
    // 配合严格 CSP（禁用脚本 + sandbox）缓解 XSS 风险，符合安全规范
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = withNextIntl(nextConfig);
