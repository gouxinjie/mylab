/**
 * @component BlogEntry
 * @description 博客入口组件
 * @author gouxinjie
 */

"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import styles from "./index.module.scss";

export default function BlogEntry() {
  const t = useTranslations("BlogEntry");

  return (
    <section className={styles['blog-section']}>
      <div className="container-custom">
        <Link
          href="https://blog.gouxinjie.com"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.entry}
        >
          {/* Left: Planet Icon */}
          <div className={styles['entry__icon-box']}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className={styles.entry__icon}>
              <circle cx="12" cy="12" r="10"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
              <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(-30 12 12)"/>
            </svg>
          </div>

          {/* Center: Text */}
          <div className={styles.entry__info}>
            <h3 className={styles.entry__title}>{t("title")}</h3>
            <p className={styles.entry__subtitle}>
              {t("subtitle")}
            </p>
          </div>

          {/* Right: Button */}
          <span className={styles.entry__btn}>
            {t("button")}
          </span>
        </Link>
      </div>
    </section>
  );
}
