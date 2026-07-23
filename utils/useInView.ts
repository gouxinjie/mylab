import { useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * 基于 IntersectionObserver 的视口可见性 Hook
 * @description 轻量替代 framer-motion 的 useInView，用于滚动进入视口触发渐入动画。
 *              关键修正：SSR / 首帧默认「不可见=未挂载」由调用方处理为可见态，
 *              避免内容因依赖 JS 而长期白屏；首屏已在视口内的元素在挂载时
 *              同步标记为可见，消除「先白屏再渐显」的闪烁。
 * @author gouxinjie
 * @created 2026-07-17
 * @updated 2026-07-23 首帧同步可见判定 + 同构 layout effect，修复白屏/闪烁
 */

/** useInView 配置项 */
interface UseInViewOptions {
  /** 是否只触发一次（默认 true，进入后不再重置） */
  once?: boolean;
  /** 根元素外扩边距，等价 framer-motion 的 margin，如 "-100px 0px" */
  margin?: string;
}

// SSR 环境下不存在 layout effect，降级为 useEffect 以避免告警
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * 监听元素是否进入视口
 * @param options - 监听配置（once / margin）
 * @returns [ref 引用, 是否可见, 是否已挂载（客户端）]
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [React.RefObject<T>, boolean, boolean] {
  const { once = true, margin = "0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const element = ref.current;
    // 标记已挂载：调用方可据此在 SSR/首帧渲染为「可见」，避免白屏
    setMounted(true);
    if (!element) return;

    // 不支持 IntersectionObserver 时直接视为可见，保证内容可展示
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    // 首帧同步检测：若元素首屏已在视口内，立即标记可见，
    // 避免「先白屏 → JS 执行 → 渐显」的可见性跳变闪烁
    const rect = element.getBoundingClientRect();
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < viewportHeight && rect.bottom > 0) {
      setInView(true);
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [once, margin]);

  return [ref, inView, mounted];
}
