/**
 * @component Markdown
 * @description 通用 Markdown 渲染组件，支持 GFM 语法、代码高亮与标题锚点
 * @author gouxinjie
 * @created 2026-07-15
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import styles from "./index.module.scss";

/** Markdown 组件属性 */
interface MarkdownProps {
  /** 待渲染的 Markdown 原文字符串 */
  content: string;
}

/**
 * Markdown 渲染组件
 * @param content - Markdown 原文
 * @returns 渲染后的富文本节点
 */
export default function Markdown({ content }: MarkdownProps) {
  return (
    <div className={styles.markdownBody}>
      <ReactMarkdown
        // remark-gfm：支持表格、任务列表、删除线等 GitHub 风格语法
        remarkPlugins={[remarkGfm]}
        // rehype-slug 为标题生成锚点 id；rehype-highlight 实现代码高亮
        rehypePlugins={[rehypeSlug, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
