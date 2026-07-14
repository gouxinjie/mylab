/**
 * @component ResumeButton
 * @description 下载简历按钮（客户端组件，处理点击阻止默认跳转）
 * @author gouxinjie
 * @created 2025-07-14
 * @updated 2025-07-14
 */

"use client";

import type { ReactNode } from "react";

interface ResumeButtonProps {
  /** 附加类名，用于继承父级样式 */
  className?: string;
  /** 按钮内容 */
  children: ReactNode;
}

/**
 * 下载简历按钮
 * @param className - 附加类名
 * @param children - 按钮内容
 * @returns 阻止默认跳转的锚点按钮
 */
export default function ResumeButton({ className, children }: ResumeButtonProps) {
  // 占位按钮：阻止点击锚点默认跳转到页面顶部
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <a href="#" className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
