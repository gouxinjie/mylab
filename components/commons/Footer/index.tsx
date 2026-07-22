/**
 * @component Footer
 * @description 页面底部组件，包含品牌信息、导航分组、法律声明与回到顶部
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-18 更新邮箱，移除设备定位反查，直接使用默认地址（中国上海）
 */

"use client";

import { useState } from "react";
import { Link, usePathname, useRouter } from "@/lib/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useApp } from "@/components/commons/AppProviders";
import styles from "./index.module.scss";

/**
 * 页脚链接项类型
 * @property label - 链接文案
 * @property href - 链接地址
 * @property external - 是否为外部链接
 * @property icon - 链接前缀图标（可选）
 */
interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
  icon?: React.ReactNode;
}

/**
 * 页脚分组类型
 * @property id - 分组唯一标识
 * @property title - 分组标题
 * @property links - 分组链接列表
 */
interface FooterSectionItem {
  id: string;
  title: string;
  links: FooterLinkItem[];
}

/** 品牌 Logo：xj 字母组合，渐变背景 */
function BrandLogo() {
  return (
    <svg
      className={styles.brand__logo}
      width="40"
      height="40"
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="footer-brand-xj" x1="0" y1="0" x2="512" y2="512" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#10B981" />
          <stop offset="1" stopColor="#059669" />
        </linearGradient>
      </defs>
      <rect width="512" height="512" rx="112" fill="url(#footer-brand-xj)" />
      <g fill="#FFFFFF">
        <path d="M118 170 L170 170 L206 224 L242 170 L294 170 L232 258 L296 350 L244 350 L206 292 L168 350 L116 350 L180 258 Z" />
        <rect x="330" y="170" width="48" height="176" rx="24" />
        <path d="M330 322 L378 322 L378 356 C378 392 350 418 312 418 L296 418 L296 372 L308 372 C322 372 330 362 330 348 Z" />
        <circle cx="354" cy="118" r="26" />
      </g>
    </svg>
  );
}

/** 邮件图标 */
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

/** 地图定位图标 */
function MapPinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/** 微信图标 */
function WechatIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 18a5 5 0 0 1-4-2.2A5 5 0 0 1 9 8a5 5 0 0 1 4 2" />
      <path d="M16 19.5A4.5 4.5 0 1 0 16 10.5a4.5 4.5 0 0 0 0 9Z" />
      <path d="M4.5 12.5A2 2 0 1 0 4.5 8.5a2 2 0 0 0 0 4Z" />
      <path d="M14 13.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6Z" />
    </svg>
  );
}

/** GitHub 图标 */
function GithubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

/** 太阳图标：用于主题切换 */
function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

/** 月亮图标：用于主题切换 */
function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

/** 闪光图标：用于品牌口号 */
function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9L12 3Z" />
      <path d="M18 17l.6 1.7L20 19l-1.4.3L18 21l-.6-1.7L16 19l1.4-.3L18 17Z" />
      <path d="m8 8 .6.7L9 10l-.7-.3L8 8Z" />
    </svg>
  );
}

/** 外部链接小箭头图标 */
function ExternalIcon() {
  return (
    <svg className={styles.section__link__external} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

/** 手风琴折叠箭头图标 */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** 向上箭头图标：回到顶部 */
function ArrowUpIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6" />
    </svg>
  );
}

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer");
  const navT = useTranslations("Navbar");
  const { resolvedTheme, setTheme } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    nav: true,
    resources: true,
    contact: true,
  });

  /**
   * 切换移动端手风琴分组展开状态
   * @param sectionId - 分组唯一标识
   */
  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  /** 切换明暗主题 */
  const toggleTheme = () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", next);
    }
  };

  /** 平滑回到页面顶部 */
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /**
   * 切换中英文：基于 next-intl 的 router 在当前路径下切换 locale
   */
  const switchLocale = () => {
    const nextLocale = locale === "zh" ? "en" : "zh";
    router.push(pathname, { locale: nextLocale });
  };

  const navLinks: FooterLinkItem[] = [
    { label: navT("home"), href: "/" },
    { label: navT("projects"), href: "/projects" },
    { label: navT("about"), href: "/about" },
    { label: navT("ai"), href: "/ai" },
    { label: navT("ainotes"), href: "/ai-notes" },
  ];

  const resourceLinks: FooterLinkItem[] = [
    { label: t("blog"), href: "http://blog.gouxinjie.com/", external: true },
    { label: "GitHub", href: "https://github.com/gouxinjie", external: true },
    { label: "Gitee", href: "https://gitee.com/gou-xinjie", external: true },
    { label: "CSDN", href: "https://blog.csdn.net/qq_43886365?type=blog", external: true },
  ];

  // 默认地址（中国 上海）
  const locationLabel = t("location");

  const contactLinks: FooterLinkItem[] = [
    { label: "gxj1311318389@163.com", href: "mailto:gxj1311318389@163.com", external: true, icon: <MailIcon /> },
    { label: "微信: 13113183859", href: "#", external: false, icon: <WechatIcon /> },
    { label: locationLabel, href: "#", external: false, icon: <MapPinIcon /> },
  ];

  const sections: FooterSectionItem[] = [
    { id: "nav", title: t("nav_title"), links: navLinks },
    { id: "resources", title: t("resources_title"), links: resourceLinks },
    { id: "contact", title: t("contact_title"), links: contactLinks },
  ];

  return (
    <div className={styles.wrapper}>
      {/* 页脚主体 */}
      <footer className={styles.footer}>
        <div className="container-custom">
          <div className={styles.grid}>
            {/* 品牌信息 */}
            <div className={styles.brand}>
              <Link href="/" className={styles.brand__link}>
                <BrandLogo />
                <span>xinjie</span>
              </Link>
              <p className={styles.brand__desc}>{t("description")}</p>
              <div className={styles.brand__socials}>
                <a
                  href="https://github.com/gouxinjie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.brand__socialBtn}
                  aria-label="GitHub"
                >
                  <GithubIcon />
                </a>
                <button
                  type="button"
                  onClick={switchLocale}
                  className={styles.brand__socialBtn}
                  aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
                >
                  <span className={styles.brand__lang}>{locale === "zh" ? "EN" : "中"}</span>
                </button>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={styles.brand__socialBtn}
                  aria-label={resolvedTheme === "dark" ? "Light" : "Dark"}
                >
                  {resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />}
                </button>
              </div>
              <div className={styles.brand__slogan}>
                <SparklesIcon />
                <span>{t("slogan")}</span>
              </div>
            </div>

            {/* 链接分组 */}
            <nav className={styles.links} aria-label={t("nav_title")}>
              {sections.map((section) => (
                <div key={section.id} className={styles.section}>
                  <button
                    type="button"
                    className={styles.section__title}
                    onClick={() => toggleSection(section.id)}
                    aria-expanded={openSections[section.id]}
                    aria-controls={`footer-section-${section.id}`}
                  >
                    <span className={styles.section__dot} aria-hidden="true" />
                    <span>{section.title}</span>
                    <span className={styles.section__chevron} aria-hidden="true">
                      <ChevronIcon open={openSections[section.id]} />
                    </span>
                  </button>
                  <ul
                    id={`footer-section-${section.id}`}
                    className={`${styles.section__list} ${openSections[section.id] ? styles.section__listOpen : ""}`}
                    aria-hidden={!openSections[section.id]}
                  >
                    {section.links.map((item) => (
                      <li key={`${section.id}-${item.label}`}>
                        {item.external ? (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.section__link}
                          >
                            {item.icon && <span className={styles.section__link__icon}>{item.icon}</span>}
                            <span>{item.label}</span>
                            <ExternalIcon />
                          </a>
                        ) : (
                          <Link href={item.href} className={styles.section__link}>
                            {item.icon && <span className={styles.section__link__icon}>{item.icon}</span>}
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* 底部版权与操作 */}
          <div className={styles.bottom}>
            <p className={styles.bottom__rights}>{t("rights")}</p>
            <button
              type="button"
              className={styles.bottom__top}
              onClick={scrollToTop}
              aria-label={t("back_to_top")}
            >
              <ArrowUpIcon />
              <span>{t("back_to_top")}</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
