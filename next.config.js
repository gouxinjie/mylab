const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 强制 Next 转译 framer-motion 及其依赖 motion-dom，
  // 修复生产构建中 server 运行时找不到 ./vendor-chunks/motion-dom.js 的问题
  transpilePackages: ['framer-motion', 'motion-dom'],
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
  },
  // 项目尚未接入 ESLint 依赖与配置，构建期跳过 lint 以免 next build 直接失败
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withNextIntl(nextConfig);
