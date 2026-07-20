/**
 * @component Navbar
 * @description 导航栏组件，包含主题切换、语言切换、移动端菜单
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-18
 */

"use client";

import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useApp } from "@/components/commons/AppProviders";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import styles from "./index.module.scss";

// 图标
function HomeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

function ProjectIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}

// AI 图标：用于「AI 相关」导航项，四角星/闪光造型呼应 AI 主题
function AiIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M18 17l.6 1.7L20 19l-1.4.3L18 21l-.6-1.7L16 19l1.4-.3L18 17z"/></svg>;
}

// 笔记图标：用于「AI 笔记」导航项，书本/文档造型
function NoteIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>;
}

function GlobeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

function SunIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>;
}

function MoonIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>;
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </>
      ) : (
        <>
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </>
      )}
    </svg>
  );
}

// 品牌图标：字母 xj，采用品牌主色翠绿渐变，与站点 icon 保持一致
function BrandLogo() {
  return (
    <svg
      className={styles.brand__logo}
      width="32"
      height="32"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="brand-xj" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#brand-xj)" />
      <g fill="#FFFFFF">
        {/* 字母 x */}
        <path d="M118 170 L170 170 L206 224 L242 170 L294 170 L232 258 L296 350 L244 350 L206 292 L168 350 L116 350 L180 258 Z" />
        {/* 字母 j 竖干 */}
        <rect x="330" y="170" width="48" height="176" rx="24" />
        {/* 字母 j 底部弯钩 */}
        <path d="M330 322 L378 322 L378 356 C378 392 350 418 312 418 L296 418 L296 372 L308 372 C322 372 330 362 330 348 Z" />
        {/* 字母 j 上方圆点 */}
        <circle cx="354" cy="118" r="26" />
      </g>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  
  const { setTheme, resolvedTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState<string>("");

  const navItems = [
    { label: t("home"), href: "/", icon: <HomeIcon /> },
    { label: t("projects"), href: "/projects", icon: <ProjectIcon /> },
    { label: t("about"), href: "/about", icon: <UserIcon /> },
    { label: t("ai"), href: "/ai", icon: <AiIcon /> },
    { label: t("ainotes"), href: "/ai-notes", icon: <NoteIcon /> },
  ];

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const switchLocale = (nextLocale: "zh" | "en") => {
    router.push(pathname, { locale: nextLocale });
    setLangMenuOpen(false);
  };

  useEffect(() => {
    setCurrentHash(window.location.hash);

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={`container-custom ${styles.header__container}`}>
        {/* 品牌标识 */}
        <Link href="/" className={styles.brand}>
          <BrandLogo />
          <span className={styles.brand__name}>xinjie</span>
        </Link>

        {/* 桌面端导航 */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const [basePath, hash] = item.href.split("#");
            const isHashLink = item.href.includes("#") && hash;
            const isActive = isHashLink
              ? pathname === basePath && currentHash === `#${hash}`
              : pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                // 显式预取目标路由的 JS 与数据，缩短首次点击时的加载等待
                prefetch
                className={`${styles.nav__link} ${isActive ? styles['nav__link--active'] : ''}`}
              >
                <span className={styles.nav__link__icon}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* 右侧操作区 */}
        <div className={styles.actions}>
          {/* 语言切换 */}
          <div className={styles['lang-menu']}>
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className={styles['lang-menu__trigger']}
              title={t("switch_locale")}
            >
              <GlobeIcon />
              <span className={styles['lang-menu__trigger__text']}>{locale === "zh" ? "中文" : "EN"}</span>
            </button>
            
            {langMenuOpen && (
              <>
                <div 
                  className={styles['lang-menu__overlay']} 
                  onClick={() => setLangMenuOpen(false)} 
                />
                <div className={styles['lang-menu__dropdown']}>
                  {[
                    { id: "zh" as const, label: "简体中文" },
                    { id: "en" as const, label: "English" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => switchLocale(item.id)}
                      className={`${styles['lang-menu__item']} ${locale === item.id ? styles['lang-menu__item--active'] : ''}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* 主题切换 */}
          <button
            onClick={toggleTheme}
            className={styles['theme-btn']}
            aria-label={t("theme_toggle")}
          >
            {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* 移动端菜单按钮 */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={styles['menu-btn']}
            aria-label="Menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* 移动端菜单（始终渲染，通过 transition 控制显隐） */}
      <div className={`${styles['mobile-menu']} ${mobileOpen ? styles['mobile-menu--open'] : ''}`}>
        {/* 移动端菜单顶部：品牌 + 关闭按钮 */}
        <div className={`container-custom ${styles['mobile-menu__top']}`}>
          <Link href="/" onClick={() => setMobileOpen(false)} className={styles.brand}>
            <BrandLogo />
            <span className={styles.brand__name}>xinjie</span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className={styles['mobile-menu__close']}
            aria-label="关闭菜单"
          >
            <MenuIcon open={true} />
          </button>
        </div>
        <nav className="container-custom">
          <div className={styles['mobile-menu__nav']}>
            {navItems.map((item) => {
              const [basePath, hash] = item.href.split("#");
              const isHashLink = item.href.includes("#") && hash;
              const isActive = isHashLink
                ? pathname === basePath && currentHash === `#${hash}`
                : pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  // 与桌面端一致，显式预取目标路由，缩短首次加载等待
                  prefetch
                  className={`${styles['mobile-menu__link']} ${isActive ? styles['mobile-menu__link--active'] : ''}`}
                >
                  <span className={styles['mobile-menu__icon']}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
          
          <div className={styles['mobile-menu__footer']}>
            <button
              onClick={() => switchLocale(locale === "zh" ? "en" : "zh")}
              className={styles['mobile-menu__foot-btn']}
            >
              <GlobeIcon />
              {locale === "zh" ? "English" : "简体中文"}
            </button>
            <button
              onClick={toggleTheme}
              className={styles['mobile-menu__foot-btn']}
            >
              {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
              {resolvedTheme === "dark" ? "Dark" : "Light"}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
