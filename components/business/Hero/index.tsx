/**
 * @component Hero
 * @description 首页英雄区域组件
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-08
 */

"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import styles from "./index.module.scss";

export default function Hero() {
  const t = useTranslations("Hero");
  const title = t("title");
  const titleParts = title.split("Web");

  return (
    <section className={styles.hero}>
      {/* 英雄区域容器 */}
      <div className="container-custom">
        {/* 背景横幅 */}
        <div className={styles.banner}>
          {/* 信息区：问候/标题/描述/按钮 */}
          <div className={styles.info}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 问候语 */}
              <span className={styles.info__greeting}>
                {t("greeting")}
              </span>
            </motion.div>

                {/* 主标题 */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className={styles.info__title}
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
                </motion.h1>

                {/* 描述 */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={styles.info__desc}
                >
                  {t("description")}
                </motion.p>

                {/* 操作按钮组 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className={styles.info__actions}
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
                </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
