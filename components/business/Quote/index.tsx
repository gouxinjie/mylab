/**
 * @component QuoteSection
 * @description 底部引用与社交链接区域组件
 * @author gouxinjie
 * @created 2026-07-18
 */

"use client";

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";

export default function QuoteSection() {
  const t = useTranslations("Quote");

  return (
    <section className={styles['quote-section']}>
      <div className="container-custom">
        <div className={styles.box}>
          {/* Quote */}
          <div className={styles.quote}>
            <div className={styles.quote__icon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
              </svg>
            </div>
            <div>
              <p className={styles.quote__text}>
                {t("text")}
              </p>
              <p className={styles.quote__subtext}>
                {t("subtext")}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className={styles.social}>
            <SocialLink href="https://github.com/gouxinjie" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            } />
            <SocialLink href="https://gitee.com/gou-xinjie" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482a.594.594 0 0 1-.593.592H9.777c-.982 0-1.778.796-1.778 1.778v5.63c0 .327.266.592.593.592h5.63c.982 0 1.778-.796 1.778-1.778v-.296a.593.593 0 0 0-.592-.593h-4.15a.592.592 0 0 1-.592-.592v-1.482a.593.593 0 0 1 .593-.592h6.815c.327 0 .593.265.593.592v3.408a4 4 0 0 1-4 4H5.926a.593.593 0 0 1-.593-.593V9.778a4.444 4.444 0 0 1 4.445-4.444h8.296Z" />
              </svg>
            } />
            <SocialLink href="https://blog.csdn.net/qq_43886365" icon={
              <span className={styles['social__csdn-text']}>CSDN</span>
            } />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.social__link}
    >
      {icon}
    </a>
  );
}
