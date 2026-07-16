/**
 * @file ai-docs.ts
 * @description AI 相关文档的目录树配置与 Markdown 读取工具
 * @author gouxinjie
 * @created 2026-07-15
 */

import fs from "node:fs";
import path from "node:path";

/** 单个文档节点（可为纯分组，也可为可点击的文章） */
export interface AiDocNode {
  /** 侧边栏展示的标题 */
  text: string;
  /** 路由 slug（英文短链），与对应 markdown 的 frontmatter.slug 字段一一对应；无 slug 表示纯分组节点 */
  slug?: string;
  /** 卡片展示描述（可选） */
  desc?: string;
  /** 图标类型标识（可选） */
  icon?: string;
  /** 图标主色（可选） */
  iconColor?: string;
  /** 子节点列表 */
  items?: AiDocNode[];
}

/** 一级分组（模块） */
export interface AiDocGroup {
  /** 分组标题，如「基础认知」 */
  text: string;
  /** 分组描述（可选） */
  desc?: string;
  /** 分组图标类型标识（可选） */
  icon?: string;
  /** 分组图标主色（可选） */
  iconColor?: string;
  /** 是否默认折叠 */
  collapsed?: boolean;
  /** 分组下的文档节点 */
  items: AiDocNode[];
}

/** 扁平化后的文档条目，用于生成静态路径与上一篇/下一篇导航 */
export interface AiDocFlatItem {
  /** 路由 slug */
  slug: string;
  /** 文档标题 */
  text: string;
  /** 所属分组标题 */
  group: string;
}

/** 文档正文与元信息 */
export interface AiDocContent {
  /** 文档标题 */
  title: string;
  /** 所属分组标题 */
  group: string;
  /** Markdown 原文（已去除 frontmatter） */
  content: string;
  /** frontmatter 中的更新时间（可选） */
  updated?: string;
}

/**
 * AI 文档目录树配置
 * @description 作为导航结构与文档顺序来源；text 为展示标题，slug 对应 markdown frontmatter 中的 slug 字段
 *              （文件名可为中文，如「基础认知/AI概念与AI Agent.md」，二者通过 slug 间接关联）
 */
export const aiDocGroups: AiDocGroup[] = [
  {
    text: "基础认知",
    desc: "从概念到协议，构建扎实的 AI 基础知识体系",
    icon: "bookOpen",
    iconColor: "#10B981",
    collapsed: false,
    items: [
      {
        text: "AI概念与AI Agent",
        slug: "ai-concept-and-agent",
        desc: "理解核心概念与 Agent 的基础",
        icon: "robot",
        iconColor: "#10B981",
      },
      {
        text: "AI模型中的token是什么",
        slug: "what-is-token",
        desc: "深入理解 token 的组成与作用",
        icon: "database",
        iconColor: "#3B82F6",
      },
      {
        text: "什么是提示词工程",
        slug: "prompt-engineering",
        desc: "写好提示词的原理与实践",
        icon: "terminal",
        iconColor: "#8B5CF6",
      },
      {
        text: "什么是RAG检索增强生成",
        slug: "rag",
        desc: "RAG 原理与落地方案",
        icon: "search",
        iconColor: "#F59E0B",
      },
      {
        text: "什么是MCP协议",
        slug: "mcp",
        desc: "MCP 协议基础与应用",
        icon: "network",
        iconColor: "#3B82F6",
      },
      {
        text: "什么是模型蒸馏",
        slug: "model-distillation",
        desc: "蒸馏技术与应用场景",
        icon: "layers",
        iconColor: "#10B981",
      },
    ],
  },
  {
    text: "工具提效",
    desc: "模板与规范，提升使用效率",
    icon: "wrench",
    iconColor: "#10B981",
    collapsed: false,
    items: [
      {
        text: "AGENTS规则约束",
        items: [
          {
            text: "什么是AGENTS.md",
            slug: "what-is-agents-md",
            desc: "AGENTS.md 规则详解",
            icon: "fileText",
            iconColor: "#3B82F6",
          },
          {
            text: "前端专用AGENTS.md模板",
            slug: "agents-md-frontend",
            desc: "适用于前端项目的模板",
            icon: "code",
            iconColor: "#10B981",
          },
          {
            text: "后端专用AGENTS.md模板",
            slug: "agents-md-backend",
            desc: "适用于后端项目的模板",
            icon: "server",
            iconColor: "#8B5CF6",
          },
        ],
      },
      {
        text: "Agent Skills",
        slug: "agent-skills",
        desc: "定制化 AI Agent 技能包",
        icon: "zap",
        iconColor: "#F59E0B",
      },
    ],
  },
];

/** Markdown 内容目录（相对项目根目录），按分类分子目录存放（基础认知 / 工具提效） */
const AI_CONTENT_DIR = path.join(process.cwd(), "content", "ai");

/** slug → 文件路径 索引缓存（模块级，避免每次请求重复递归扫描磁盘） */
let slugIndexCache: Map<string, string> | null = null;

/**
 * 构建 slug → 文件路径 索引（全目录递归一次，建立映射）
 * @returns slug 到 markdown 绝对路径的映射
 */
const buildSlugIndex = (): Map<string, string> => {
  const index = new Map<string, string>();
  const walk = (dir: string): void => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.endsWith(".md")) {
        const { data } = parseFrontmatter(fs.readFileSync(full, "utf-8"));
        if (data.slug) {
          index.set(data.slug, full);
        }
      }
    }
  };
  walk(AI_CONTENT_DIR);
  return index;
};

/**
 * 获取 slug → 文件路径 索引（带模块级缓存）
 * @description 生产环境构建一次后复用；开发环境每次重建以支持新增文档热更新
 * @returns slug 到 markdown 绝对路径的映射
 */
const getSlugIndex = (): Map<string, string> => {
  if (!slugIndexCache || process.env.NODE_ENV !== "production") {
    slugIndexCache = buildSlugIndex();
  }
  return slugIndexCache;
};

/**
 * 根据 slug 查找对应 markdown 文件路径
 * @description 通过模块级索引 O(1) 命中（索引在首次调用时递归构建），支持中文文件名与分类子目录
 * @param slug - 文档 slug（英文路由）
 * @returns 文件绝对路径；未找到时返回 null
 */
const findDocFilePath = (slug: string): string | null => {
  return getSlugIndex().get(slug) ?? null;
};

/** frontmatter 解析结果 */
interface FrontmatterResult {
  /** frontmatter 键值对 */
  data: Record<string, string>;
  /** 去除 frontmatter 后的正文 */
  content: string;
}

/**
 * 轻量 frontmatter 解析器
 * @description 解析 markdown 顶部 --- 包裹的简单 key: value 元信息，避免引入额外依赖
 * @param raw - markdown 原始字符串
 * @returns 元信息键值对与去除 frontmatter 后的正文
 */
const parseFrontmatter = (raw: string): FrontmatterResult => {
  const normalized = raw.replace(/\r\n/g, "\n");
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n?/);

  if (!match) {
    return { data: {}, content: normalized };
  }

  const data: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const idx = line.indexOf(":");
    if (idx === -1) {
      return;
    }
    const key = line.slice(0, idx).trim();
    // 去除值两侧空白与引号
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) {
      data[key] = value;
    }
  });

  return { data, content: normalized.slice(match[0].length) };
};

/**
 * 递归扁平化目录树，得到所有可点击文档条目（按目录顺序）
 * @returns 扁平化的文档条目数组
 */
export const getFlatDocList = (): AiDocFlatItem[] => {
  const result: AiDocFlatItem[] = [];

  const walk = (nodes: AiDocNode[], group: string): void => {
    nodes.forEach((node) => {
      if (node.slug) {
        result.push({ slug: node.slug, text: node.text, group });
      }
      if (node.items && node.items.length > 0) {
        walk(node.items, group);
      }
    });
  };

  aiDocGroups.forEach((groupItem) => {
    walk(groupItem.items, groupItem.text);
  });

  return result;
};

/**
 * 获取全部文档 slug，用于 generateStaticParams 生成静态路径
 * @returns slug 字符串数组
 */
export const getAllDocSlugs = (): string[] => {
  return getFlatDocList().map((item) => item.slug);
};

/**
 * 根据 slug 查找该文档在扁平列表中的元信息与相邻文档
 * @param slug - 文档 slug
 * @returns 当前文档、上一篇、下一篇（不存在时为 null）
 */
export const getDocNeighbors = (
  slug: string
): {
  current: AiDocFlatItem | null;
  prev: AiDocFlatItem | null;
  next: AiDocFlatItem | null;
} => {
  const list = getFlatDocList();
  const index = list.findIndex((item) => item.slug === slug);

  if (index === -1) {
    return { current: null, prev: null, next: null };
  }

  return {
    current: list[index],
    prev: index > 0 ? list[index - 1] : null,
    next: index < list.length - 1 ? list[index + 1] : null,
  };
};

/**
 * 读取指定 slug 对应的 Markdown 文档内容
 * @param slug - 文档 slug（英文路由，对应 content/ai 下某 markdown 的 frontmatter.slug）
 * @returns 文档正文与元信息；文件不存在时返回 null
 */
export const getDocContent = (slug: string): AiDocContent | null => {
  const meta = getFlatDocList().find((item) => item.slug === slug);
  if (!meta) {
    return null;
  }

  // 按 frontmatter 中的 slug 递归查找文件（支持中文文件名与分类子目录）
  const filePath = findDocFilePath(slug);
  if (!filePath) {
    return null;
  }

  // 读取文件并解析 frontmatter（如 title、updated 等）
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = parseFrontmatter(raw);

  return {
    title: data.title || meta.text,
    group: meta.group,
    content,
    updated: data.updated,
  };
};
