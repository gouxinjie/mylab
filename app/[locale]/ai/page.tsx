/**
 * AIPage
 * @description AI 产品概览页：标题 + 分类 Tab 过滤的产品展示
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-23 AI 产品数据通过服务器组件传递给客户端组件
 */

import React from "react";
import { Metadata } from "next";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import AiFeatures from "@/components/business/AiFeatures";
import AiProducts from "@/components/business/AiProducts";
import { aiProducts, aiRegionLabels, aiCategoryLabels, categoryOrder } from "@/lib/ai-products";
import styles from "./page.module.scss";

export const metadata: Metadata = {
  title: "AI 相关",
  description:
    "探索主流 AI 产品和服务，涵盖大语言模型、AI 绘画、代码助手、效率工具等前沿 AI 技术与产品。",
  openGraph: {
    title: "AI 产品 | xinjie",
    description: "前沿 AI 技术与产品探索",
  },
};

export default async function AIPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  // 启用静态渲染，避免 next-intl 在 Server Component 中强制动态渲染
  unstable_setRequestLocale(locale);
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

      {/* 分类 Tab + 产品网格（客户端交互，数据由服务端传入） */}
      <AiProducts
        aiProducts={aiProducts}
        aiRegionLabels={aiRegionLabels}
        aiCategoryLabels={aiCategoryLabels}
        categoryOrder={categoryOrder}
      />

      {/* 底部特性模块：安全可靠 / 高效便捷 / 持续更新 */}
      <AiFeatures />
    </section>
  );
}
