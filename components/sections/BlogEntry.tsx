import Link from "next/link";

export default function BlogEntry() {
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
            <h3 className="text-lg font-semibold">探索更多技术分享与思考</h3>
            <p className="mt-1 text-sm text-gray-400">
              欢迎访问我的博客，阅读最新的技术文章和教程
            </p>
          </div>

          {/* Right: Button */}
          <span className="btn-primary shrink-0 whitespace-nowrap bg-white/10 hover:bg-white/20 group-hover:bg-[var(--color-primary)]">
            访问博客 →
          </span>
        </Link>
      </div>
    </section>
  );
}
