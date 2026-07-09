import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';

/**
 * i18n 配置
 * @description next-intl 请求配置，用于加载对应语言的翻译文件
 * @author gouxinjie
 */

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // 验证 locale 是否合法
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
