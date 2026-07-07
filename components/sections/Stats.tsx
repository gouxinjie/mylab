"use client";

import { githubStats } from "@/lib/data";

const statCards = [
  {
    label: "项目总量",
    labelEn: "Projects",
    value: "50+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-primary)]">
        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
      </svg>
    ),
  },
  {
    label: "GitHub Stars",
    labelEn: "Stars",
    value: "1.2k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-[var(--color-primary)]">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    label: "开源仓库",
    labelEn: "Repositories",
    value: "30+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-primary)]">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
        <line x1="15" y1="8" x2="17" y2="8" />
        <line x1="15" y1="12" x2="17" y2="12" />
      </svg>
    ),
  },
  {
    label: "提交次数",
    labelEn: "Commits",
    value: "1.3k+",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-primary)]">
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="16" x2="12" y2="21" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="4.93" y1="7.93" x2="7.76" y2="10.76" />
        <line x1="16.24" y1="13.27" x2="19.07" y2="16.1" />
        <line x1="19.07" y1="7.93" x2="16.24" y2="10.76" />
        <line x1="7.76" y1="13.27" x2="4.93" y2="16.1" />
      </svg>
    ),
  },
];

export default function Stats() {
  return (
    <section className="-mt-6 py-10 sm:py-14">
      <div className="container-custom">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:gap-8">
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 text-center transition-all hover:border-[var(--color-primary)]/30 hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
                {stat.icon}
              </span>
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs text-[var(--color-text-muted)]">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
