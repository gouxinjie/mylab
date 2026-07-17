/**
 * @component Markdown
 * @description 通用 Markdown 渲染组件，支持 GFM 语法、代码高亮与标题锚点
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-17
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { common, createLowlight } from "lowlight";
import styles from "./index.module.scss";
import type { Components } from "react-markdown";

// 仅注册常用语言子集（common 约 37 种），避免 rehype-highlight 默认加载全量 200+ 语言，
// 从而减轻 SSR 计算负担并缩小生成的 HTML 体积，改善详情页 TTFB
const lowlight = createLowlight(common);

/** Markdown 组件属性 */
interface MarkdownProps {
  /** 待渲染的 Markdown 原文字符串 */
  content: string;
  /** 自定义渲染组件（如覆盖标题、代码块等），用于注入锚点或样式 */
  components?: Components;
}

/**
 * Markdown 渲染组件
 * @param content - Markdown 原文
 * @param components - 自定义渲染组件
 * @returns 渲染后的富文本节点
 */
export default function Markdown({ content, components }: MarkdownProps) {
  return (
    <div className={styles.markdownBody}>
      <ReactMarkdown
        // remark-gfm：支持表格、任务列表、删除线等 GitHub 风格语法
        remarkPlugins={[remarkGfm]}
        // rehype-highlight 使用受限语言子集实现代码高亮
        rehypePlugins={[[rehypeHighlight, { lowlight, detect: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

