"use client";

import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useApp } from "./AppProviders";
import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";

/**
 * @component Navbar
 * @description 导航栏组件，包含主题切换、语言切换、移动端菜单
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navbar");
  
  const { setTheme, resolvedTheme } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  // 监听滚动，改变导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t("home"), href: "/", icon: <HomeIcon /> },
    { label: t("about"), href: "/about", icon: <UserIcon /> },
    { label: t("projects"), href: "/projects", icon: <ProjectIcon /> },
    { label: t("ai"), href: "/ai", icon: <AIIcon /> },
    { label: t("contact"), href: "/contact", icon: <MailIcon /> },
  ];

  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const switchLocale = (nextLocale: string) => {
    router.push(pathname, { locale: nextLocale });
    setLangMenuOpen(false);
  };

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md py-1.5" 
          : "bg-transparent py-3"
      }`}
    >
      <div className="container-custom flex h-12 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-base sm:text-lg active:scale-95 transition-transform group">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-sm font-bold text-white shadow-lg group-hover:rotate-12 transition-transform">
            XJ
          </span>
          <span className="hidden sm:inline bg-gradient-to-r from-[var(--color-text-primary)] to-[var(--color-text-secondary)] bg-clip-text text-transparent">xinjie</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "text-[var(--color-primary)] bg-[var(--color-primary)]/5"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)]"
                }`}
              >
                <span className="opacity-70">{item.icon}</span>
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 h-0.5 w-2 -translate-x-1/2 rounded-full bg-[var(--color-primary)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95"
              title={t("switch_locale")}
            >
              <GlobeIcon />
              <span className="min-w-[20px]">{locale === "zh" ? "中" : "EN"}</span>
            </button>
            
            {langMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setLangMenuOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-32 origin-top-right rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-20 animate-in fade-in zoom-in-95 duration-100">
                  {[
                    { id: "zh", label: "简体中文" },
                    { id: "en", label: "English" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => switchLocale(item.id)}
                      className={`flex w-full items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        locale === item.id
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-95"
            aria-label={t("theme_toggle")}
          >
            {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-full md:hidden active:scale-95 transition-transform border border-[var(--color-border)]"
            aria-label="Menu"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden pt-20 bg-[var(--color-bg)]/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="container-custom space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 rounded-2xl px-5 py-4 text-lg font-medium transition-all active:scale-95 ${
                    isActive
                      ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                      : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)]"
                  }`}
                >
                  <span className={isActive ? "text-[var(--color-primary)]" : "text-[var(--color-text-muted)]"}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
            
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-8">
              <button
                onClick={() => switchLocale(locale === "zh" ? "en" : "zh")}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] py-4 text-sm font-medium text-[var(--color-text-secondary)] active:scale-95"
              >
                <GlobeIcon />
                {locale === "zh" ? "English" : "简体中文"}
              </button>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] py-4 text-sm font-medium text-[var(--color-text-secondary)] active:scale-95"
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

// Icons
function HomeIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}

function UserIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

function ProjectIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>;
}

function AIIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 12.1"/><path d="M12 12l9.9-0.1"/><path d="M12 12V22"/><path d="M12 12l-7-7"/><path d="M12 12l7 7"/></svg>;
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
