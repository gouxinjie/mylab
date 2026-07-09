/**
 * @component Navbar
 * @description 导航栏组件，包含主题切换、语言切换、移动端菜单
 * @author gouxinjie
 * @created 2024
 * @updated 2024
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

function MailIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
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
    { label: t("about"), href: "/about", icon: <UserIcon /> },
    { label: t("projects"), href: "/projects", icon: <ProjectIcon /> },
    { label: t("contact"), href: "/contact", icon: <MailIcon /> },
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
          <span className={styles.brand__logo}>
            K
          </span>
          <span className={styles.brand__name}>Kiro</span>
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
              <span className={styles['lang-menu__trigger__text']}>{locale === "zh" ? "中" : "EN"}</span>
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

      {/* 移动端菜单 */}
      {mobileOpen && (
        <div className={styles['mobile-menu']}>
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
                    className={`${styles['mobile-menu__link']} ${isActive ? styles['mobile-menu__link--active'] : ''}`}
                  >
                    <span className={styles['mobile-menu__icon']}>
                      {item.icon}
                    </span>
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
      )}
    </header>
  );
}
