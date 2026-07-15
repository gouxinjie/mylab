/**
 * @component Footer
 * @description 页面底部组件，包含导航链接、资源链接和社交媒体
 * @author gouxinjie
 * @created 2024
 * @updated 2024
 */

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import styles from "./index.module.scss";

export default function Footer() {
  const t = useTranslations("Footer");
  const navT = useTranslations("Navbar");

  return (
    <footer className={styles.footer}>
      <div className="container-custom">
        <div className={styles.grid}>
          {/* 品牌信息 */}
          <div className={styles.brand}>
            <Link href="/" className={styles.brand__link}>
              <span className={styles.brand__logo}>
                xj
              </span>
              <span>xinjie</span>
            </Link>
            <p className={styles.brand__desc}>
              {t("description")}
            </p>
            <p className={styles.brand__rights}>
              {t("rights")}
            </p>
          </div>

          {/* 导航 */}
          <div>
            <h3 className={styles.section__title}>
              {t("nav_title")}
            </h3>
            <ul className={styles.section__list}>
              {[
                { label: navT("home"), href: "/" },
                { label: navT("projects"), href: "/projects" },
                { label: navT("about"), href: "/about" },
                { label: navT("contact"), href: "/contact" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.section__link}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 资源 */}
          <div>
            <h3 className={styles.section__title}>
              {t("resources_title")}
            </h3>
            <ul className={styles.section__list}>
              {[
                { label: t("blog"), href: "https://blog.gouxinjie.com", external: true },
                { label: "GitHub", href: "https://github.com/gouxinjie", external: true },
                { label: "RSS", href: "#", external: true },
                { label: "Sitemap", href: "/sitemap.xml", external: false },
              ].map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.section__link}
                    >
                      {item.label}
                      <svg className={styles.section__link__icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={styles.section__link}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </footer>
  );
}
