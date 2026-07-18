/**
 * @component Stats
 * @description 统计数字展示组件
 * @author gouxinjie
 * @created 2026-07-18
 * @updated 2026-07-18
 */

"use client";

import { useTranslations } from "next-intl";
import styles from "./index.module.scss";

export default function Stats() {
  const t = useTranslations("Stats");

  const statCards = [
    {
      label: t("projects"),
      value: "50+",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
        </svg>
      ),
    },
    {
      label: t("stars"),
      value: "1.2k+",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: t("repos"),
      value: "30+",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="8" x2="17" y2="8" />
          <line x1="15" y1="12" x2="17" y2="12" />
        </svg>
      ),
    },
    {
      label: t("commits"),
      value: "1.3k+",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="4.93" y1="7.93" x2="7.76" y2="10.76" />
          <line x1="16.24" y1="13.27" x2="19.07" y2="16.1" />
          <line x1="19.07" y1="7.93" x2="16.24" y2="10.76" />
          <line x1="7.76" y1="13.27" x2="4.93" y2="16.1" />
        </svg>
      ),
    },
  ];

  return (
    <section className={styles.stats}>
      <div className="container-custom">
        <div className={styles.grid}>
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className={styles.card}
            >
              <span className={styles['card__icon-box']}>
                {stat.icon}
              </span>
              <span className={styles.card__value}>{stat.value}</span>
              <span className={styles.card__label}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
