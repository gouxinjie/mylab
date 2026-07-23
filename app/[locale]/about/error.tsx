/**
 * @file error.tsx
 * @description About 路由级错误边界：渲染异常时展示提示与重试，避免空白页。
 *              使用静态文案，不依赖 i18n 实例，确保错误边界自身不会二次崩溃。
 * @author gouxinjie
 * @created 2026-07-23
 */

"use client";

interface AboutErrorProps {
  /** 捕获的错误对象 */
  error: Error & { digest?: string };
  /** 重试并重置路由的回调函数 */
  reset: () => void;
}

export default function AboutError({ error, reset }: AboutErrorProps) {
  return (
    <div className="container-custom" style={{ maxWidth: 980, padding: "48px 0", textAlign: "center" }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 12 }}>
        页面加载失败
      </h2>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 20 }}>
        关于页出现了一些问题，请稍后重试。
      </p>
      <button type="button" className="btn-primary" onClick={reset}>
        重新加载
      </button>
      {/* 开发环境输出错误详情，便于排查 */}
      {process.env.NODE_ENV !== "production" && (
        <pre style={{ marginTop: 16, color: "var(--color-text-muted)", fontSize: 12, whiteSpace: "pre-wrap" }}>
          {error.message}
        </pre>
      )}
    </div>
  );
}
