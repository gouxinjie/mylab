import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

/**
 * i18n 配置
 * @description next-intl 请求配置，用于加载对应语言的翻译文件
 * @author gouxinjie
 */

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  // 优先使用 requestLocale（避免内部调用 headers，支持静态渲染）
  const locale = await requestLocale;
  // 验证 locale 是否合法
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
