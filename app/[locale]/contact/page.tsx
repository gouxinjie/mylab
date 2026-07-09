import { Metadata } from "next";
import { socialLinks } from "@/lib/data";
import FadeIn from "@/components/commons/FadeIn";
import { useTranslations } from "next-intl";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "Contact",
};

const socialIcons: Record<string, JSX.Element> = {
  github: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
  ),
  twitter: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  ),
  linkedin: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  ),
  email: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
  ),
};

export default function ContactPage() {
  const t = useTranslations("Contact");

  return (
    <div className={styles['contact-page']}>
      <div className="container-custom" style={{ maxWidth: '672px' }}>
        <FadeIn>
          <div className={styles.header}>
            <h1 className={styles.header__title}>{t("title")}</h1>
            <p className={styles.header__subtitle}>
              {t("subtitle")}
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className={styles.grid}>
            {socialLinks.map((link, idx) => (
              <FadeIn key={link.name} delay={0.1 * idx}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles['contact-item']}
                >
                  <span className={styles['contact-item__icon-wrapper']}>
                    {socialIcons[link.icon] || null}
                  </span>
                  <div>
                    <h3 className={styles['contact-item__title']}>{link.name}</h3>
                    <p className={styles['contact-item__value']}>{link.url.replace("mailto:", "").replace("https://", "")}</p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={styles['contact-item__arrow']}
                  >
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              </FadeIn>
            ))}
          </div>
        </FadeIn>

        {/* Additional note */}
        <FadeIn delay={0.3}>
          <div className={styles.note}>
            <p className={styles.note__text}>
              {t("blog_note")}
              {" "}
              <a
                href="https://blog.gouxinjie.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.note__link}
              >
                blog.gouxinjie.com
              </a>
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
