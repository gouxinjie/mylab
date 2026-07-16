import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import AiFeatures from "@/components/business/AiFeatures";
import AiProducts from "@/components/business/AiProducts";
import styles from "./page.module.scss";

/**
 * AIPage
 * @description AI 产品概览页：标题 + 分类 Tab 过滤的产品展示
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-16
 */

export const metadata: Metadata = {
  title: "AI 相关",
};

export default async function AIPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  setRequestLocale(locale);
  const t = await getTranslations("AI");

  return (
    <section className={styles.products}>
      <header className={styles.products__head}>
        <h2 className={styles.products__title}>
          {t("products_title").split("AI").reduce<React.ReactNode[]>(
            (prev, part, i) => {
              if (i === 0) return [part];
              return [...prev, <span key={i} className={styles["products__title--highlight"]}>AI</span>, part];
            },
            [],
          )}
        </h2>
        <p className={styles.products__subtitle}>{t("products_subtitle")}</p>
      </header>

      {/* 分类 Tab + 产品网格（客户端交互） */}
      <AiProducts />

      {/* 底部特性模块：安全可靠 / 高效便捷 / 持续更新 */}
      <AiFeatures />
    </section>
  );
}
