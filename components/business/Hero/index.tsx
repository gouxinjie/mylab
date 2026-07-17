/**
 * @component Hero
 * @description 首页英雄区域组件
 * @author gouxinjie
 * @created 2024
 * @updated 2026-07-17
 */

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import PageBanner from "@/components/commons/PageBanner";
import styles from "./index.module.scss";

export default function Hero() {
  const t = useTranslations("Hero");
  const title = t("title");
  const titleParts = title.split("Web");

  return (
    <section className={styles.hero}>
      <div className="container-custom">
        {/* 通用页头横幅：背景图 + 左侧文案 */}
        <PageBanner bgImage="/images/hero-bg-1.png" bottomMargin="0" priority>
          <div className={styles.info}>
            <span
              className={`${styles.info__greeting} ${styles.animRise}`}
              style={{ animationDelay: "0s" }}
            >
              {t("greeting")}
            </span>

            {/* 主标题 */}
            <h1
              className={`${styles.info__title} ${styles.animRise}`}
              style={{ animationDelay: "0.1s" }}
            >
              {titleParts.length > 1 ? (
                <>
                  {titleParts[0]}
                  <span className={styles.info__highlight}>Web</span>
                  {titleParts.slice(1).join("Web")}
                </>
              ) : (
                title
              )}
            </h1>

            {/* 描述 */}
            <p
              className={`${styles.info__desc} ${styles.animRise}`}
              style={{ animationDelay: "0.2s" }}
            >
              {t("description")}
            </p>

            {/* 操作按钮组 */}
            <div
              className={`${styles.info__actions} ${styles.animRise}`}
              style={{ animationDelay: "0.3s" }}
            >
              <Link
                href="/projects"
                className={`${styles['btn-hero']} ${styles['btn-hero--primary']}`}
              >
                {t("view_projects")}
              </Link>
              <Link
                href="/about"
                className={`${styles['btn-hero']} ${styles['btn-hero--outline']}`}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                {t("learn_more")}
              </Link>
            </div>
          </div>
        </PageBanner>
      </div>
    </section>
  );
}
