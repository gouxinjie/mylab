"use client";

import { Link } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/**
 * @component Hero
 * @description 首页英雄区域组件，按照设计稿重新实现
 * @author gouxinjie
 * @created 2024
 * @updated 2024-07-08
 */

export default function Hero() {
  const t = useTranslations("Hero");
  const title = t("title");
  const titleParts = title.split("Web");

  return (
    <section className="bg-white pt-8 pb-6 sm:pt-12 sm:pb-8">
      <div className="container-custom">
        <div
          className="relative overflow-hidden"
          style={{
            backgroundImage: "url('/images/hero-bg.png')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/40 lg:to-transparent" />
          <div className="relative z-10 flex flex-col items-start">
            <div className="w-full pt-24 lg:pt-0">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] sm:text-base">
                    {t("greeting")}
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="mt-4 whitespace-pre-line text-3xl font-bold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-4xl lg:text-5xl xl:text-6xl"
                >
                  {titleParts.length > 1 ? (
                    <>
                      {titleParts[0]}
                      <span className="text-[#10b981]">Web</span>
                      {titleParts.slice(1).join("Web")}
                    </>
                  ) : (
                    title
                  )}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg lg:max-w-xl"
                >
                  {t("description")}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-5 flex flex-wrap items-center gap-4"
                >
                  <Link
                    href="/projects"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#10b981] px-8 text-sm font-medium text-white transition-all hover:bg-[#059669] hover:shadow-lg active:scale-95"
                  >
                    {t("view_projects")}
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-border)] bg-white px-8 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-gray-50 active:scale-95"
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
                      className="mr-2"
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
        </div>
      </div>
    </section>
  );
}
