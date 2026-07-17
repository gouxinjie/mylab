/**
 * @component Services
 * @description "我能做什么" 区域组件
 * @author gouxinjie
 * @created 2024-07-08
 * @updated 2026-07-17
 */

import { useTranslations } from "next-intl";
import FadeIn from "@/components/commons/FadeIn";
import styles from "./index.module.scss";

const iconMap = {
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  palette: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" />
      <circle cx="17.5" cy="10.5" r=".5" />
      <circle cx="8.5" cy="7.5" r=".5" />
      <circle cx="6.5" cy="12.5" r=".5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.103-1.206.35-.639.303-1.41-.115-2.029C13.572 18.15 13.5 17.585 13.5 17a2.5 2.5 0 0 1 5 0c0 .585-.072 1.15-.488 1.765-.418.619-.465 1.39-.115 2.029C18.293 21.516 19.074 22 20 22c5.5 0 10-4.5 10-10S25.5 2 20 2z" />
    </svg>
  ),
  zap: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  chart: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="18" y1="20" x2="18" y2="10" />
    </svg>
  ),
  sparkles: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" />
      <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
    </svg>
  ),
  rocket: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
};

export default function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as Array<{ title: string; description: string; icon: string }>;

  return (
    <section className={styles.services}>
      <div className="container-custom">
        <FadeIn className={styles.header}>
          <h2 className={styles.header__title}>
            {t("title")}
          </h2>
        </FadeIn>

        <div className={styles.grid}>
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap.code;
            return (
              <FadeIn
                key={item.title}
                className={styles.item}
                delay={idx * 0.1}
              >
                <div className={styles['item__icon-box']}>
                  {Icon}
                </div>
                <h3 className={styles.item__title}>
                  {item.title}
                </h3>
                <p className={styles.item__desc}>
                  {item.description}
                </p>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
