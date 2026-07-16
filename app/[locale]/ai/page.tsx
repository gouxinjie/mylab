import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
        <h2 className={styles.products__title}>{t("products_title")}</h2>
        <p className={styles.products__subtitle}>{t("products_subtitle")}</p>
      </header>

      {/* 分类 Tab + 产品网格（客户端交互） */}
      <AiProducts />
    </section>
  );
}
