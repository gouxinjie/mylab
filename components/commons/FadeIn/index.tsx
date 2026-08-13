/**
 * @component FadeIn 滚动渐入容器
 * @description 滚动渐入动画容器。当前暂不使用动画：始终直接渲染为「可见」状态，
 *              保留组件 API 以兼容现有调用方，后续需恢复渐入动画时可在本组件内开启。
 * @author gouxinjie
 * @created 2026-07-17
 * @updated 2026-08-13 暂不使用滚动渐入动画，组件始终渲染可见内容
 */

import { ReactNode } from "react";
import styles from "./index.module.scss";

/** FadeIn 组件属性 */
interface FadeInProps {
  /** 子内容 */
  children: ReactNode;
  /** 额外类名 */
  className?: string;
  /** 【已废弃】动画延迟（秒），当前暂不使用动画，保留以兼容旧调用方 */
  delay?: number;
  /** 【已废弃】初始纵向位移（px），当前暂不使用动画，保留以兼容旧调用方 */
  y?: number;
  /** 【已废弃】视口外扩边距，当前暂不使用动画，保留以兼容旧调用方 */
  margin?: string;
}

export default function FadeIn({
  children,
  className = "",
}: FadeInProps) {
  // 暂不使用滚动渐入动画：始终渲染为可见状态
  return (
    <div className={`${styles.fadeIn} ${className}`.trim()}>{children}</div>
  );
}
