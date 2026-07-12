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
                { label: navT("about"), href: "/about" },
                { label: navT("skills"), href: "/about#skills" },
                { label: navT("projects"), href: "/projects" },
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

          {/* 社交 */}
          <div>
            <h3 className={styles.section__title}>
              {t("social_title")}
            </h3>
            <div className={styles.social}>
              {[
                {
                  name: "GitHub",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                  ),
                  href: "https://github.com/gouxinjie",
                },
                {
                  name: "Gitee",
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z"/></svg>
                  ),
                  href: "https://gitee.com/gou-xinjie",
                },
                {
                  name: "CSDN",
                  icon: (
                    <span className={styles.social__csdn}>CSDN</span>
                  ),
                  href: "https://blog.csdn.net/qq_43886365",
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.social__link}
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
