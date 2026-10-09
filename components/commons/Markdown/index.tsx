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
import { ossImageUrl } from "@/utils/oss";

/**
 * 文章配图输出宽度
 * @description 正文展示宽度约 720px，取 1600 兼顾高分屏与灯箱放大查看；
 *              由 OSS 端缩放转码，实测 496KB 的原图可压到约 126KB；
 *              若更看重加载速度，可下调到 1200（约 90KB）
 */
const ARTICLE_IMAGE_WIDTH = 1600;

/** 文章配图压缩质量：兼顾截图类图片的文字清晰度 */
const ARTICLE_IMAGE_QUALITY = 75;

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
    // 文章内的本地 /images 图片统一转换为带 OSS 处理参数的地址，缩放与转码由 OSS 完成
    return (
      <ImageZoom
        src={
          typeof src === "string"
            ? ossImageUrl(src, { width: ARTICLE_IMAGE_WIDTH, quality: ARTICLE_IMAGE_QUALITY })
            : undefined
        }
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
  // 解构排除 node（react-markdown 注入的 AST 节点），避免其被展开到真实 DOM。
  // 用 node: _node 重命名：既匹配 react-markdown 真实属性名，又以 _ 前缀满足 ESLint 未使用变量规则
  a({ node: _node, href, children, ...rest }) {
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

