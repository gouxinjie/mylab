"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

/**
 * @component BlogEntry
 * @description 博客入口组件
 * @author gouxinjie
 */

export default function BlogEntry() {
  const t = useTranslations("BlogEntry");

  return (
    <section className="py-10">
      <div className="container-custom">
        <Link
          href="https://blog.gouxinjie.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center justify-between gap-6 rounded-2xl border border-[var(--color-primary)]/20 bg-[var(--color-bg-dark)] p-8 text-white transition-all hover:border-[var(--color-primary)]/50 sm:flex-row"
        >
          {/* Left: Planet Icon */}
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/5">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--color-primary)]">
              <circle cx="12" cy="12" r="10"/>
              <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-30 12 12)"/>
              <ellipse cx="12" cy="12" rx="4" ry="10" transform="rotate(-30 12 12)"/>
            </svg>
          </div>

          {/* Center: Text */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold">{t("title")}</h3>
            <p className="mt-1 text-sm text-gray-400">
              {t("subtitle")}
            </p>
          </div>

          {/* Right: Button */}
          <span className="btn-primary shrink-0 whitespace-nowrap bg-white/10 hover:bg-white/20 group-hover:bg-[var(--color-primary)]">
            {t("button")}
          </span>
        </Link>
      </div>
    </section>
  );
}
