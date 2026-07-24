/**
 * RootLayout（根布局 - 透传）
 * @description 由于项目在根目录提供了 app/not-found.tsx（文档级 404），
 *              Next.js 要求必须存在根布局文件，即便它只是透传 children。
 *              <html> 与 <body> 由 app/[locale]/layout.tsx 负责渲染，
 *              此处不重复输出，避免嵌套 html 标签。
 * @author gouxinjie
 * @updated 2026-07-24 新增透传根布局，满足 not-found.tsx 的根布局约束
 */

import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// 因根目录存在 not-found.tsx，Next.js 要求提供根布局，即使仅透传 children
export default function RootLayout({ children }: Props) {
  return children;
}
