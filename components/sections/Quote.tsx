"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

/**
 * @component QuoteSection
 * @description 底部引用与社交链接区域组件
 * @author gouxinjie
 * @created 2024-07-08
 */

export default function QuoteSection() {
  const t = useTranslations("Quote");

  return (
    <section className="py-8 bg-gray-50/30">
      <div className="container-custom">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-white p-6 shadow-sm border border-gray-100 lg:flex-row lg:p-8">
          {/* Quote */}
          <div className="flex items-start gap-4 lg:max-w-2xl">
            <div className="text-[#10b981] flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2H5c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.75-2-2-2h-3c-1.25 0-2 .75-2 2v3c0 1.25.75 2 2 2h3c0 4-4 6-4 6" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-[var(--color-text-primary)] sm:text-2xl">
                {t("text")}
              </p>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                {t("subtext")}
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <SocialLink href="https://github.com/gouxinjie" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            } />
            <SocialLink href="mailto:gouxinjie@example.com" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            } />
            <SocialLink href="https://linkedin.com/in/gouxinjie" icon={
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            } />
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition-all hover:bg-[#10b981] hover:text-white hover:shadow-lg hover:shadow-[#10b981]/20 active:scale-95"
    >
      {icon}
    </a>
  );
}
