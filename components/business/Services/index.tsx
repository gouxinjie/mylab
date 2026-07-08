/**
 * @component Services
 * @description "我能做什么" 区域组件
 * @author gouxinjie
 * @created 2024-07-08
 */

"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

const iconMap = {
  code: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  database: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
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
};

export default function Services() {
  const t = useTranslations("Services");
  const items = t.raw("items") as Array<{ title: string; description: string; icon: string }>;

  return (
    <section className={styles.services}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.header}
        >
          <h2 className={styles.header__title}>
            {t("title")}
          </h2>
        </motion.div>

        <div className={styles.grid}>
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap.code;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={styles.item}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
