import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

/**
 * i18n 配置
 * @description next-intl 请求配置，用于加载对应语言的翻译文件
 * @author gouxinjie
 */

export const locales = ['zh', 'en'] as const;
export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // 校验从路由段解析出的 locale（已在布局中通过 unstable_setRequestLocale 设置，支持静态渲染）
  if (!locale || !locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
