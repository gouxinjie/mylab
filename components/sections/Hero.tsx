"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-bg-warm)] via-[var(--color-bg)] to-white py-20 sm:py-28">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-orange-50/40 to-transparent" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[var(--color-primary)]/5 blur-3xl" />
      </div>

      <div className="container-custom">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Content */}
          <div>
            {/* Tag */}
            <span className="mb-4 inline-block rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-1 text-xs font-medium text-[var(--color-primary-dark)]">
              ⚡ 全栈开发 · AI 探索者 · 开源爱好者
            </span>

            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              用代码构建价值，
              <br />
              用{" "}
              <span className="bg-gradient-to-r from-[var(--color-accent-orange)] to-[var(--color-primary)] bg-clip-text text-transparent">
                AI
              </span>{" "}
              探索未来。
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[var(--color-text-secondary)] sm:text-lg">
              你好，我是 xinjie，一名热爱技术的全栈开发者。
              <br />
              我专注于构建高质量的 Web 应用，探索 AI 的无限可能，并通过开源项目分享与成长。
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="btn-primary group">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                </svg>
                查看我的项目
              </Link>
              <Link href="/about" className="btn-outline">
                了解更多关于我 →
              </Link>
            </div>

            {/* Social Links */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-sm text-[var(--color-text-muted)]">Find me on</span>
              {["github", "twitter", "linkedin", "zhihu", "email"].map((social) => (
                <a
                  key={social}
                  href="#"
                  aria-label={social}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                >
                  <SocialIcon name={social} />
                </a>
              ))}
            </div>
          </div>

          {/* Right: Code Block Visual */}
          <div className="hidden lg:block">
            <div className="rounded-xl border border-gray-200 bg-gray-900 p-6 font-mono text-sm shadow-2xl">
              <div className="mb-4 flex gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <pre className="text-gray-300 leading-relaxed">
                <code>{`const xinjie = {
  role: "Full Stack Developer",
  passion: "AI & Open Source",
  focus: "Building useful things",
  currently: 'Always learning',
};

// 🌍 Hello World! 👋`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex justify-center">
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-[var(--color-text-muted)]">向下了解我 ↓</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text-muted)]">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    github: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
    ),
    twitter: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    ),
    linkedin: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ),
    zhihu: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M5.721 0C2.251 0 0 2.25 0 5.71V18.29C0 21.75 2.25 24 5.721 24H18.28c3.47 0 5.72-2.25 5.72-5.71V5.71C24 2.25 21.75 0 18.28 0H5.72zm1.964 4.078c.92 0 1.664.744 1.664 1.664s-.744 1.664-1.664 1.664a1.664 1.664 0 110-3.328zM5.142 9h3.342v8.196H5.142V9zm4.543 0h2.976l.174 1.143h.058c.58-.867 1.65-1.358 2.804-1.358 2.908 0 3.594 1.913 3.594 4.41v4.001h-3.342v-3.48c0-1.096-.02-2.506-1.527-2.506-1.53 0-1.764 1.195-1.764 2.43v3.556H9.685V9z"/></svg>
    ),
    email: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
    ),
  };
  return icons[name] || null;
}
