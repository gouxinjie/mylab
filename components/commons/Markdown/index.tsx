/**
 * @component Markdown
 * @description 通用 Markdown 渲染组件，支持 GFM 语法、代码高亮与标题锚点
 * @author gouxinjie
 * @created 2026-07-15
 * @updated 2026-07-20
 */

import { isValidElement, type CSSProperties, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { common, createLowlight } from "lowlight";
import styles from "./index.module.scss";
import type { Components } from "react-markdown";
import Mermaid from "./Mermaid";
import ImageZoom from "@/components/commons/ImageZoom";

// 仅注册常用语言子集（common 约 37 种），避免 rehype-highlight 默认加载全量 200+ 语言，
// 从而减轻 SSR 计算负担并缩小生成的 HTML 体积，改善详情页 TTFB
const lowlight = createLowlight(common);

/**
 * 从图片 title 中解析尺寸约定，格式（不区分大小写）：
 *   w=500 / width=500  →  宽度
 *   h=300 / height=300 →  高度
 * 仅作为尺寸指令的 title 不会被当作悬浮提示渲染。
 * @param title - 图片的 title 文本
 * @returns 解析出的 width / height（像素字符串）以及去除尺寸指令后的剩余 title
 */
const parseImageSize = (
  title?: string
): { width?: string; height?: string; restTitle?: string } => {
  if (!title) return {};
  const widthMatch = title.match(/(?:^|\s)(?:w|width)=(\d+)/i);
  const heightMatch = title.match(/(?:^|\s)(?:h|height)=(\d+)/i);
  const restTitle = title
    .replace(/(?:^|\s)(?:w|width|h|height)=\d+/gi, "")
    .trim() || undefined;
  return {
    width: widthMatch?.[1],
    height: heightMatch?.[1],
    restTitle,
  };
};

// 默认渲染组件：统一接管图片与 Mermaid 代码块
const defaultComponents: Components = {
  img({ title, style, src, alt }) {
    const { width, height, restTitle } = parseImageSize(title);
    const imgStyle: CSSProperties = { maxWidth: "100%", ...style };
    if (width) imgStyle.width = `${width}px`;
    if (height) imgStyle.height = `${height}px`;
    // 交由 ImageZoom 渲染：点击可弹出灯箱并按原始比例放大查看
    return (
      <ImageZoom
        src={typeof src === "string" ? src : undefined}
        alt={typeof alt === "string" ? alt : undefined}
        title={restTitle}
        style={imgStyle}
      />
    );
  },
  // 仅对 ```mermaid 代码块渲染为图表，其余代码块保持默认 <pre> 行为
  pre({ children }) {
    const codeChild = Array.isArray(children) ? children[0] : children;
    if (isValidElement(codeChild)) {
      const codeProps = codeChild.props as { className?: string; children?: ReactNode };
      if (codeProps.className?.includes("language-mermaid")) {
        const chart = String(codeProps.children ?? "");
        return <Mermaid chart={chart} />;
      }
    }
    return <pre>{children}</pre>;
  },
  // 外链（http/https）在新标签页打开，并补齐安全 rel，避免反向 tab 劫持
  // 解构排除 node（react-markdown 注入的 AST 节点），避免其被展开到真实 DOM
  a({ _node, href, children, ...rest }) {
    const isExternal = !!href && /^https?:\/\//i.test(href);
    if (isExternal) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
          {children}
        </a>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
};

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
        // 合并默认组件（图片尺寸控制）与调用方自定义组件，调用方优先级更高
        components={{ ...defaultComponents, ...components }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

