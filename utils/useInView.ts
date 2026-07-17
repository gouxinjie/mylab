import { useEffect, useRef, useState } from "react";

/**
 * 基于 IntersectionObserver 的视口可见性 Hook
 * @description 轻量替代 framer-motion 的 useInView，用于滚动进入视口触发渐入动画
 * @author gouxinjie
 * @created 2026-07-17
 */

/** useInView 配置项 */
interface UseInViewOptions {
  /** 是否只触发一次（默认 true，进入后不再重置） */
  once?: boolean;
  /** 根元素外扩边距，等价 framer-motion 的 margin，如 "-100px 0px" */
  margin?: string;
}

/**
 * 监听元素是否进入视口
 * @param options - 监听配置（once / margin）
 * @returns [ref 引用, 是否可见]
 */
export function useInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions = {},
): [React.RefObject<T>, boolean] {
  const { once = true, margin = "0px" } = options;
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // 不支持 IntersectionObserver 时直接视为可见，保证内容可展示
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
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

  return [ref, inView];
}
