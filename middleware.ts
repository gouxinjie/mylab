import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n';

/**
 * i18n 中间件
 * @description 处理语言路由重定向和检测
 * @author gouxinjie
 */

export default createMiddleware({
  // 支持的语言列表
  locales: locales,

  // 默认语言
  defaultLocale: 'zh',
  
  // 始终在 URL 中显示语言前缀
  localePrefix: 'always'
});

export const config = {
  // 匹配所有需要国际化的路由，排除 api, _next, 静态资源等
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
