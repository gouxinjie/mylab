import { createSharedPathnamesNavigation } from 'next-intl/navigation';
import { locales } from '../i18n';

/**
 * 共享导航工具
 * @description 基于 next-intl 的路由工具，支持语言感知的跳转和路径获取
 * @author gouxinjie
 */

export const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({ locales });
