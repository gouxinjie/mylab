"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      {/* Big number */}
      <div className="relative">
        <span className="block text-[120px] sm:text-[180px] font-bold leading-none text-[var(--color-primary)]/10">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--color-text-muted)]">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
      </div>

      <h1 className="mt-6 text-xl font-semibold sm:text-2xl">页面走丢了</h1>
      <p className="mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
        你访问的页面不存在，或者已经被移到了其他地方。
      </p>

      <div className="mt-8 flex gap-3">
        <Link href="/" className="btn-primary">返回首页</Link>
        <Link href="/projects" className="btn-outline">查看项目</Link>
      </div>
    </div>
  );
}
