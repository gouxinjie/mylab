"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/**
 * @component Services
 * @description "我能做什么" 区域组件
 * @author gouxinjie
 * @created 2024-07-08
 */

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
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.707-.484 2.103-1.206.35-.639.303-1.41-.115-2.029C13.572 18.15 13.5 17.585 13.5 17a2.5 2.5 0 0 1 5 0c0 .585-.072 1.15-.488 1.765-.418.619-.465 1.39-.115 2.029C18.293 21.516 19.074 22 20 22c5.5 0 10-4.5 10-10S25.5 22 20 22c-5.5 0-10-4.5-10-10S14.5 2 20 2z" />
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
    <section className="py-8 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)] sm:text-3xl">
            {t("title")}
          </h2>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => {
            const Icon = iconMap[item.icon as keyof typeof iconMap] || iconMap.code;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group rounded-2xl border border-gray-100 bg-gray-50/50 p-5 transition-all hover:bg-white hover:shadow-xl hover:shadow-gray-200/50"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm transition-transform group-hover:scale-110 text-[#10b981]">
                  {Icon}
                </div>
                <h3 className="mb-2 text-lg font-bold text-[var(--color-text-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
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
