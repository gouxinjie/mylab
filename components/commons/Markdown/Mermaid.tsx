"use client";

/**
 * @component Mermaid
 * @description 客户端 Mermaid 图表渲染组件，将 mermaid 代码块源码渲染为 SVG。
 *              仅在浏览器端动态加载 mermaid，避免 SSR 触碰 DOM 并实现代码分割；
 *              渲染失败时回退展示原始代码块，保证内容不丢失。
 * @author gouxinjie
 * @created 2026-07-20
 * @updated 2026-07-20
 */

import { useEffect, useRef, useState } from "react";

/** Mermaid 组件属性 */
interface MermaidProps {
  /** mermaid 图表源码字符串 */
  chart: string;
}

// 模块级缓存 mermaid 实例的加载 Promise，避免同一会话内重复动态加载
let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

/**
 * 懒加载并初始化 mermaid 实例（仅浏览器端执行）
 * @returns 已初始化的 mermaid 实例
 */
const getMermaid = (): Promise<typeof import("mermaid").default> => {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((mod) => {
      const mermaid = mod.default;
      // startOnLoad=false：由组件手动触发渲染，避免全局副作用
      // securityLevel=strict：对生成的 SVG 做净化，降低 XSS 风险
      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        securityLevel: "strict",
      });
      return mermaid;
    });
  }
  return mermaidPromise;
};

/**
 * Mermaid 图表渲染组件
 * @param chart - mermaid 图表源码
 * @returns 渲染后的 SVG 容器，失败则回退为原始代码块
 */
const Mermaid = ({ chart }: MermaidProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isCancelled = false;
    setHasError(false);

    getMermaid()
      .then((mermaid) => {
        if (isCancelled) return;
        // 生成唯一 id，避免同页多个图表 id 冲突
        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        return mermaid.render(id, chart);
      })
      .then(({ svg }) => {
        if (isCancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
      })
      .catch(() => {
        if (!isCancelled) setHasError(true);
      });

    return () => {
      isCancelled = true;
    };
  }, [chart]);

  // 渲染失败时回退展示原始代码，内容不丢失
  if (hasError) {
    return <pre className="mermaid-fallback">{chart}</pre>;
  }

  return <div ref={containerRef} className="mermaid-diagram" />;
};

export default Mermaid;
